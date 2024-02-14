<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserTrait,
    UserBoardTrait,
    FailSchemeTrait,
    BoardPermissionsTrait,
};

class PermissionToManageBoardUsersCest
{
    use HashTrait, UserTrait, UserBoardTrait, FailSchemeTrait, BoardPermissionsTrait;

    public function testUserAssignedToBoardHasPostAccessWithManagePermissionToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на добавление пользователей в доску у пользователя, добавленного в доску, с разрешением управления пользователями доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-users');

        [$onAddUserId] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $body = [
            'formData' => [
                'ids' => [
                    $onAddUserId,
                ]
            ],
        ];

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $onAddUserId,
            'role_id' => null,
        ]);
    }

    public function testUserAssignedToBoardHasNoPostAccessWithoutManagePermissionToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на добавление пользователей в доску у пользователя, добавленного в доску, без разрешения управления пользователями доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        [$onAddUserId] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $body = [
            'formData' => [
                'ids' => [
                    $onAddUserId,
                ]
            ],
        ];

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(403);
    }

    public function testUserAssignedToBoardHasDeleteAccessWithManagePermissionToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить наличие доступа на удаление пользователя из доски у пользователя, добавленного в доску, с разрешением управления пользователями доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        $this->assignPermissionToBoardUser($I, $boardId, $tryToManageUserId, 'manage-board-users');

        [$onDeleteUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $onDeleteUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$onDeleteUserId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $onDeleteUserId,
            'role_id' => null,
        ]);
    }

    public function testUserAssignedToBoardHasNoDeleteAccessWithoutManagePermissionToBoardUsers(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление пользователя из доски у пользователя, добавленного в доску, с разрешением управления пользователями доски');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$tryToManageUserId, $tryToManageUserEmail] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $tryToManageUserId);

        [$onDeleteUserId] = $this->createUser($I);

        $this->assignUserToBoard($I, $boardId, $onDeleteUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $tryToManageUserEmail);

        $I->sendDelete("/v1/boards/$boardId/users/$onDeleteUserId");

        $I->seeResponseCodeIs(403);
    }

}