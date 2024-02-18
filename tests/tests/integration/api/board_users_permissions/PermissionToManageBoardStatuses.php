<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserBoardTrait,
    BoardPermissionsTrait,
    BoardStatusTrait,
    UserTrait,
};

class PermissionToManageBoardStatuses
{
    use UserBoardTrait, BoardPermissionsTrait, UserTrait, HashTrait, BoardStatusTrait;

    public function testUserAssignedToBoardHasAccessToStatuses(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа к статусам доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendGet("/v1/boards/$boardId/statuses");
        $I->seeResponseCodeIs(200);
        $I->seeResponseContains($statusId);
    }

    public function testUserAssignedToBoardHasNoCreateAccessToBoardStatuses(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на создание статуса доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPost("/v1/boards/$boardId/statuses", []);
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasNoPutAccessToBoardStatuses(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на изменение статуса доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPut("/v1/boards/$boardId/statuses/$statusId", []);
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasNoDeleteAccessToBoardStatuses(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление статуса доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/boards/$boardId/statuses/$statusId");
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasCreateAccessToBoardStatusesWithManageBoardStatusesPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на создание статуса доски у пользователя, добавленного в доску с разрешением на управление статусами доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-statuses');

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPost("/v1/boards/$boardId/statuses", [
            'formData' => [
                'name' => $this->generateHash(),
            ],
        ]);

        $I->seeResponseCodeIs(201);
    }

    public function testUserAssignedToBoardHasPutAccessToBoardStatusesWithManageBoardStatusesPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на изменение статуса доски у пользователя, добавленного в доску с разрешением на управление статусами доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-statuses');

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPut("/v1/boards/$boardId/statuses/$statusId", [
            'formData' => [
                'name' => $this->generateHash(),
            ],
        ]);

        $I->seeResponseCodeIs(200);
    }

    public function testUserAssignedToBoardHasDeleteAccessToBoardStatusesWithManageBoardStatusesPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на удаление статуса доски у пользователя, добавленного в доску с разрешением на удаление статуса доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'delete-board-statuses');

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/boards/$boardId/statuses/$statusId");
        $I->seeResponseCodeIs(204);
    }
}