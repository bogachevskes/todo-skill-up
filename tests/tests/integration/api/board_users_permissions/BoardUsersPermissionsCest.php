<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserTrait,
    UserBoardTrait,
    BoardPermissionsTrait,
    FailSchemeTrait,
};

class BoardUsersPermissionsCest
{
    use BoardPermissionsTrait, UserBoardTrait, HashTrait, FailSchemeTrait, UserTrait;

    public function testUserBoardOwnerHasGetAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа у владельца доски на получение списка разрешений другого пользователя доски');

        [$ownerUserId, $ownerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $ownerUserEmail);

        $I->sendGet("/v1/boards/$boardId/users/$addedToBoardUserId/permissions");
        $I->seeResponseCodeIs(200);
    }

    public function testUserBoardOwnerHasPutAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа у владельца доски на изменение разрешения другого пользователя доски');

        [$ownerUserId, $ownerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $ownerUserEmail);

        $I->sendPut("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserBoardOwnerHasDeleteAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа у владельца доски на удаление разрешения другого пользователя доски');

        [$ownerUserId, $ownerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $ownerUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserNotAssignedToBoardHasNoGetAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на получение списка разрешений другого пользователя доски у пользователя, не добавленного в доску');

        [$ownerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/boards/$boardId/users/$addedToBoardUserId/permissions");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPutAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на изменение разрешения другого пользователя доски у пользователя, не добавленного в доску');

        [$ownerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPut("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
        $I->dontSeeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserNotAssignedToBoardHasNoDeleteAccessToBoardUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление разрешения другого пользователя доски у пользователя, не добавленного в доску');

        [$ownerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $ownerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $ownerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
        $I->seeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }
}