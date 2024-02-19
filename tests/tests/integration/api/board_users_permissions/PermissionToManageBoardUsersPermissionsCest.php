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

/**
 * TODO:
 * Выполнить доработки тестов
 * https://github.com/bogachevskes/todo-skill-up/issues/49
 */
class PermissionToManageBoardUsersPermissionsCest
{
    use HashTrait, UserTrait, UserBoardTrait, BoardPermissionsTrait, FailSchemeTrait;

    public function testUserAssignedToBoardHasGetPermissionToOtherUserPermissionsWithManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие у пользователя, добавленного в доску, с разрешением управления пользователями доски, доступа на получение списка разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-users');

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendGet("/v1/boards/$boardId/users/$addedToBoardUserId/permissions");

        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson([
            $permission,
        ]);
    }

    public function testUserAssignedToBoardHasPutPermissionToOtherUserPermissionsWithManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие у пользователя, добавленного в доску, с разрешением управления пользователями доски, доступа на изменение разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-users');

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPut("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserAssignedToBoardHasDeletePermissionToOtherUserPermissionsWithManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие у пользователя, добавленного в доску, с разрешением управления пользователями доски, доступа на удаление разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-users');

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserAssignedToBoardHasNoGetPermissionToOtherUserPermissionsWithoutManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие у пользователя, добавленного в доску, без разрешения управления пользователями доски, доступа на получение списка разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendGet("/v1/boards/$boardId/users/$addedToBoardUserId/permissions");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserAssignedToBoardHasNoPutPermissionToOtherUserPermissionsWithoutManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие у пользователя, добавленного в доску, без разрешения управления пользователями доски, доступа на изменение разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPut("/v1/boards/$boardId/users/$addedToBoardUserId/permissions/$permission");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
        $I->dontSeeInDatabase('auth_assignment', [
            'item_name' => $permission,
            'user_id' => $addedToBoardUserId,
            'object_id' => $boardId,
        ]);
    }

    public function testUserAssignedToBoardHasNoDeletePermissionToOtherUserPermissionsWithoutManageBoardUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие у пользователя, добавленного в доску, без разрешения управления пользователями доски, доступа на удаление разрешений пользователя доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$addedToBoardUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $addedToBoardUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $permission = $this->generateHash(15);

        $this->createBoardPermission($I, $permission);
        $this->assignPermissionToBoardUser($I, $boardId, $addedToBoardUserId, $permission);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

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