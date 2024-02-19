<?php

namespace integration\api\board_users_permissions;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    HashTrait,
    UserBoardTrait,
    UserTrait,
};

class PermissionsToBoardPermissionCest
{
    use FailSchemeTrait, UserTrait, HashTrait, UserBoardTrait;

    public function testUserNotAssignedToBoardHasNoGetAccessToBoardPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие доступа на получение списка разрешений доски у пользователя, не добавленного в доску');

        [$boardOwnerUserId] = $this->createUser($I);

        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        [$notExistingInBoardUserId, $notExistingInBoardUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('X-BASE-AUTH', $notExistingInBoardUserEmail);

        $I->sendGet("/v1/boards/$boardId/permissions");

        $I->seeResponseCodeIs(403);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}