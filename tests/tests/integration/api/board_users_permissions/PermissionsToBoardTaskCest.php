<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserTrait,
    UserBoardTrait,
    BoardStatusTrait,
    BoardTaskTrait,
    FailSchemeTrait,
};

class PermissionsToBoardTaskCest
{
    use FailSchemeTrait, HashTrait, UserTrait, UserBoardTrait, BoardStatusTrait, BoardTaskTrait;

    public function testUserNotAssignedToBoardHasNoGetAccessToBoardTasks(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на чтение задач доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $this->createBoardTask($I, $boardId, $statusId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/boards/$boardId/tasks");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPostAccessToBoardTasks(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на создание задач доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $this->createBoardTask($I, $boardId, $statusId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPost("/v1/boards/$boardId/tasks", []);

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPutAccessToBoardTasks(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на изменение задач доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPut("/v1/boards/$boardId/tasks/$taskId", []);

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPatchAccessToBoardTasks(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на частичное изменение задач доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPut("/v1/boards/$boardId/tasks/$taskId", []);

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoDeleteAccessToBoardTasks(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление задач доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $taskId = $this->createBoardTask($I, $boardId, $statusId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendDelete("/v1/boards/$boardId/tasks/$taskId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}