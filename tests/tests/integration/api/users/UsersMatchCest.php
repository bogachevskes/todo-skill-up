<?php

namespace tests\integration\api\users;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    HashTrait,
    UserTrait,
};

class UsersMatchCest
{
    use FailSchemeTrait, UserTrait, HashTrait;

    public function testMatchOneUserByEmail(ApiTester $I): void
    {
        $I->wantTo('Получить информацию о пользователе по почте');

        [$onFindUserId, $onFindUserEmail] = $this->createUser($I);

        [$onMatchUserId, $onMatchUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $onFindUserEmail);

        $I->sendGet('/v1/users/match?email=' . substr($onMatchUserEmail, 0, 5));
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'items' => [
                [
                    'id' => $onMatchUserId,
                    'email' => $onMatchUserEmail,
                ],
            ],
        ]);
    }

    public function testMatchEmptyUsersListOnNotExistingEntry(ApiTester $I): void
    {
        $I->wantTo('Получить пустой список пользователей, по несуществующей почте');

        [$onFindUserId, $onFindUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $onFindUserEmail);

        $I->sendGet('/v1/users/match?email=entry.not.exists');
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([]);
    }

    public function testMatchFailOnShortEmailEntry(ApiTester $I): void
    {
        $I->wantTo('Не получить список пользователей по причине короткого значения почты');

        [$onFindUserId, $onFindUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $onFindUserEmail);

        $I->sendGet('/v1/users/match?email=tttt');
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testMatchFailOnTooLongEmailEntry(ApiTester $I): void
    {
        $I->wantTo('Не получить список пользователей по причине слишком длинного значения почты');

        [$onFindUserId, $onFindUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $onFindUserEmail);

        $I->sendGet('/v1/users/match?email=' . $this->generateHash(101));
        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}