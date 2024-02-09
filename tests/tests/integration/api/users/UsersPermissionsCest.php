<?php

namespace tests\integration\api\users;

use Tests\Support\ApiTester;

class UsersPermissionsCest
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

    public function testListCurrentUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Получить разрешения пользователя');

        $user = [
            'name' => 'guest110',
            'email' => 'guest110@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);

        $userId = $I->grabFromDatabase('users', 'id', ['email' => $user['email']]);

        $I->haveInDatabase('auth_item', [
            'name' => 'role1',
            'type' => 2,
        ]);

        $I->haveInDatabase('auth_item', [
            'name' => 'permission1',
            'type' => 2,
        ]);

        $I->haveInDatabase('auth_item_child', [
            'parent' => 'role1',
            'child' => 'permission1',
        ]);

        $I->haveInDatabase('auth_assignment', [
            'item_name' => 'role1',
            'user_id' => $userId,
        ]);

        $I->haveHttpHeader('X-BASE-AUTH', $user['email']);

        $I->sendGet("/v1/user/$userId/permissions");

        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            'permission1',
        ]);
    }

    public function testListPermissionsFailOnAnotherUser(ApiTester $I): void
    {
        $I->wantTo('Получить ошибку недоступности разрешений другого пользователя');

        $owner = [
            'name' => 'guest111',
            'email' => 'guest111@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $user = [
            'name' => 'guest112',
            'email' => 'guest112@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $owner);
        $I->haveInDatabase('users', $user);

        $userId = $I->grabFromDatabase('users', 'id', ['email' => $user['email']]);

        $I->haveInDatabase('auth_item', [
            'name' => 'permission2',
            'type' => 2,
        ]);

        $I->haveInDatabase('auth_assignment', [
            'item_name' => 'permission2',
            'user_id' => $userId,
        ]);

        $I->haveHttpHeader('X-BASE-AUTH', $owner['email']);

        $I->sendGet("/v1/user/$userId/permissions");
        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }
}