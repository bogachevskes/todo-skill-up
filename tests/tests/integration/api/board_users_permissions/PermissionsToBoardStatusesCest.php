<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    HashTrait,
    UserTrait,
    UserBoardTrait,
    BoardStatusTrait,
    FailSchemeTrait,
};

class PermissionsToBoardStatusesCest
{
    use FailSchemeTrait, HashTrait, UserBoardTrait, UserTrait, BoardStatusTrait;

    public function testUserNotAssignedToBoardHasNoGetAccessToBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на чтение статусов доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $this->createBoardStatus($I, $boardId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I, 2);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/boards/$boardId/statuses");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPutAccessToBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на изменение статуса доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPut("/v1/boards/$boardId/statuses/$statusId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPatchAccessToBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на частичное изменение статуса доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPatch("/v1/boards/$boardId/statuses/$statusId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoDeleteAccessToBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление статуса доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendDelete("/v1/boards/$boardId/statuses/$statusId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}