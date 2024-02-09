<?php

namespace tests\integration\api\users;

use Tests\Support\ApiTester;

class UsersMatchCest
{
    private array $schemas = [
        'failScheme' => [
            'type' => 'object',
            'properties' => [
                'cause' => ['type' => 'string'],
                'type' => ['type' => 'string'],
                'data' => ['type' => 'array'],
            ],
            'required' => ['cause', 'type', 'data'],
            'additionalProperties' => false,
        ],
    ];

    public function testMatchOneUserByEmail(ApiTester $I): void
    {
        $I->wantTo('Получить информацию о пользователе по почте');

        $user = [
            'name' => 'guest114',
            'email' => 'guest114@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $userOnMatch = [
            'name' => 'guest115',
            'email' => 'guest115@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);
        $I->haveInDatabase('users', $userOnMatch);

        $userOnMatchId = $I->grabFromDatabase('users', 'id', ['email' => $userOnMatch['email']]);

        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet('/v1/users/match?email=guest115');
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'items' => [
                [
                    'id' => $userOnMatchId,
                    'email' => $userOnMatch['email'],
                ],
            ],
        ]);
    }

    public function testMatchCoupleUsersByEmailEntry(ApiTester $I): void
    {
        $I->wantTo('Получить информацию о пользователях по вхождению значения почты');

        $user = [
            'name' => 'guest114',
            'email' => 'guest114@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $usersOnMatch = [
            [
                'name' => 'CouplePartGuest1',
                'email' => 'couple.part.guest1@todo-list.com',
                'password' => base64_encode('secret'),
            ],
            [
                'name' => 'CouplePartGuest2',
                'email' => 'couple.part.guest2@todo-list.com',
                'password' => base64_encode('secret'),
            ],
            [
                'name' => 'CouplePartGuest3',
                'email' => 'couple.part.guest3@todo-list.com',
                'password' => base64_encode('secret'),
            ],
        ];

        $I->haveInDatabase('users', $user);

        foreach ($usersOnMatch as $userOnMatch) {
            $I->haveInDatabase('users', $userOnMatch);
        }

        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet('/v1/users/match?email=couple.part.guest');
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'items' => [
                [
                    'email' => $usersOnMatch[0]['email'],
                ],
                [
                    'email' => $usersOnMatch[1]['email'],
                ],
                [
                    'email' => $usersOnMatch[2]['email'],
                ],
            ],
        ]);
    }

    public function testMatchEmptyUsersListOnNotExistingEntry(ApiTester $I): void
    {
        $I->wantTo('Получить пустой список пользователей, по несуществующей почте');

        $user = [
            'name' => 'checkExisting',
            'email' => 'check.existing1@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);
        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet('/v1/users/match?email=entry.not.exists');
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([]);
    }

    public function testMatchFailOnShortEmailEntry(ApiTester $I): void
    {
        $I->wantTo('Не получить список пользователей по причине короткого значения почты');

        $user = [
            'name' => 'checkExisting2',
            'email' => 'check.existing2@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);
        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet('/v1/users/match?email=tttt');
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testMatchFailOnTooLongEmailEntry(ApiTester $I): void
    {
        $I->wantTo('Не получить список пользователей по причине слишком длинного значения почты');

        $user = [
            'name' => 'checkExisting2',
            'email' => 'check.existing2@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);
        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet('/v1/users/match?email=' . str_repeat('t', 101));
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }
}