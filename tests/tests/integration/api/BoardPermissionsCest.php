<?php

namespace tests\integration\api;

use Tests\Support\{
    ApiTester,
    UserTrait,
    HashTrait,
    UserBoardTrait,
};

class BoardPermissionsCest
{
    use UserTrait, HashTrait, UserBoardTrait;

    public function testBoardPermission(ApiTester $I): void
    {
        $I->wantTo('Получить разрешения доски');

        $boardPermissions = [
            'permission1',
            'permission2',
            'permission3',
        ];

        foreach ($boardPermissions as $permission) {
            $I->haveInDatabase('auth_item', [
                'name' => $permission,
                'type' => 3,
            ]);
        }

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);
        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $I->sendGet("/v1/boards/$boardId/permissions");
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson($boardPermissions);
    }

    public function testBoardPermissionResponseNotContainsSystemPermissions(ApiTester $I): void
    {
        $I->wantTo('Отсутствие в ответе разрешений доски, прочих разрешений, являющихся системными');

        [$boardOwnerUserId, $boardOwnerUserEmail] = $this->createUser($I);
        $boardId = $this->createBoard($I, $boardOwnerUserId);

        $this->assignUserToBoardAsOwner($I, $boardId, $boardOwnerUserId);

        $I->haveHttpHeader('X-BASE-AUTH', $boardOwnerUserEmail);

        $notBoardPermission = [
            [
                'name' => 'some_role',
                'type' => 1,
            ],
            [
                'name' => 'not_a_board_permission',
                'type' => 2,
            ]
        ];

        foreach ($notBoardPermission as $permission) {
            $I->haveInDatabase('auth_item', $permission);
        }

        $I->sendGet("/v1/boards/$boardId/permissions");
        $I->seeResponseCodeIs(200);
        $I->dontSeeResponseContainsJson($notBoardPermission);
    }
}