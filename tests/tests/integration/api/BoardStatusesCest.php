<?php

namespace tests\integration\api;

use Tests\Support\{
    ApiTester,
    UserTrait,
    HashTrait,
    UserBoardTrait,
    BoardStatusTrait,
};

class BoardStatusesCest
{
    use UserTrait, HashTrait, UserBoardTrait, BoardStatusTrait;

    public function testCreateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Создать статус доски задач');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I, 1);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $status = [
            'name' => $this->generateHash(),
        ];

        $I->sendPost("/v1/boards/$boardId/statuses", [
            'formData' => $status,
        ]);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('task_statuses', $status);
    }

    public function testBoardStatusesSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа статусов доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I, 2);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendGet("/v1/boards/$boardId/statuses");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'boardId' => 'integer',
            'name' => 'string',
            'createdAt' => 'string',
        ]);
    }

    public function testUpdateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Изменить статус задач доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $updatedStatus = [
            'name' => $this->generateHash(),
        ];

        $I->sendPut("/v1/boards/$boardId/statuses/$statusId", [
            'formData' => $updatedStatus,
        ]);

        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('task_statuses', $updatedStatus);
    }

    public function testDeleteBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Удалить статус задач доски');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $statusId = $this->createBoardStatus($I, $boardId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendDelete("/v1/boards/$boardId/statuses/$statusId");

        $I->seeResponseCodeIs(204);
        $I->dontSeeInDatabase('task_statuses', ['id' => $statusId]);
    }
}