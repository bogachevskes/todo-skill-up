<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    HashTrait,
    UserBoardTrait,
    UserTrait,
};

class PermissionsToBoardCest
{
    use UserBoardTrait, UserTrait, HashTrait, FailSchemeTrait;

    public function testUserNotAssignedToBoardHasNoGetAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на чтение доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/user/$notExistingInBoardUserId/boards/$boardId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPutAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на изменение доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPut("/v1/user/$notExistingInBoardUserId/boards/$boardId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoPatchAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на частичное изменение доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');
        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendPatch("/v1/user/$notExistingInBoardUserId/boards/$boardId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testUserNotAssignedToBoardHasNoDeleteAccessToBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на удаление доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendDelete("/v1/user/$notExistingInBoardUserId/boards/$boardId");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}