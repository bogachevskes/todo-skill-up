<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserBoardTrait,
    BoardPermissionsTrait,
    UserTrait,
};

class PermissionToManageBoardCest
{
    use UserBoardTrait, BoardPermissionsTrait, UserTrait, HashTrait;

    public function testUserAssignedToBoardHasBoardInAllowedBoardsList(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа к доске у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendGet("/v1/user/$tryToManageUserId/boards");
        $I->seeResponseCodeIs(200);
        $I->seeResponseContains($boardId);
    }

    public function testUserAssignedToBoardHasGetAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа к доске у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendGet("/v1/user/$tryToManageUserId/boards/$boardId");
        $I->seeResponseCodeIs(200);
    }

    public function testUserAssignedToBoardHasNoPutAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на редактирование доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPut("/v1/user/$tryToManageUserId/boards/$boardId", []);
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasNoPatchAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на частичное редактирование доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendPatch("/v1/user/$tryToManageUserId/boards/$boardId", []);
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasPutAccessToBoardWithManageBoardPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на редактирование доски у пользователя, добавленного в доску с разрешением на управление доской');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board');

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $board = [
            'name' => $this->generateHash(15),
            'description' => $this->generateHash(25),
        ];

        $I->sendPut("/v1/user/$tryToManageUserId/boards/$boardId", [
            'formData' => $board,
        ]);
        $I->seeResponseCodeIs(200);
    }

    public function testUserAssignedToBoardHasPatchAccessToBoardWithManageBoardPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на частичное редактирование доски у пользователя, добавленного в доску c разрешением на управление доской');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board');

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $board = [
            'description' => $this->generateHash(25),
        ];

        $I->sendPatch("/v1/user/$tryToManageUserId/boards/$boardId", [
            'formData' => $board,
        ]);
        $I->seeResponseCodeIs(200);
    }

    public function testUserAssignedToBoardHasNoDeleteAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление доски у пользователя, добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/user/$tryToManageUserId/boards/$boardId");
        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasDeleteAccessToBoardWithManageBoardPermission(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на удаление доски у пользователя, добавленного в доску c разрешением на удаление доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'delete-board');

        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/user/$tryToManageUserId/boards/$boardId");
        $I->seeResponseCodeIs(204);
    }
}