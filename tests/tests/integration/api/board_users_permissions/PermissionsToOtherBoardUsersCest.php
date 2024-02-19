<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    FailSchemeTrait,
    UserTrait,
    UserBoardTrait,
};

class PermissionsToOtherBoardUsersCest
{
    use HashTrait, FailSchemeTrait, UserTrait, UserBoardTrait;

    public function testUserNotAssignedToBoardHasNoGetAccessToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на получение списка пользователей доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/boards/$boardId/users");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPostAccessToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на создание пользователя доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPost("/v1/boards/$boardId/users", []);

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoDeleteAccessToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление пользователя доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        [$boardUserIdOnDelete] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $boardUserIdOnDelete);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$boardUserIdOnDelete", []);

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}