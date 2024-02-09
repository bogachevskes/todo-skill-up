<?php

namespace tests\integration\api;

use Tests\Support\ApiTester;

class BoardPermissionsCest
{
    private function createUser(ApiTester $I, int $nameId): array
    {
        $user = [
            'name' => "boardStatusesCestGuest$nameId",
            'email' => "board.statuses.cest.guest$nameId@todo-list.com",
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);

        $userId = $I->grabFromDatabase('users', 'id', ['email' => $user['email']]);

        return [
            $userId,
            $user['email'],
        ];
    }

    private function createBoard(ApiTester $I, int $nameId, int $userId): int
    {
        $board = [
            'name' => "user board cest name $nameId",
            'description' => "user board cest description $nameId",
        ];

        $I->haveInDatabase('boards', $board);

        $boardId = $I->grabFromDatabase('boards', 'id', ['name' => $board['name']]);

        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ];

        $I->haveInDatabase('boards_users', $boardUser);

        return $boardId;
    }

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

        [$userId, $email] = $this->createUser($I, 1);
        $boardId = $this->createBoard($I, 1, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);

        $I->sendGet("/v1/boards/$boardId/permissions");
        $I->seeResponseCodeIs(200);
        $I->seeResponseContainsJson($boardPermissions);
    }

    public function testBoardPermissionResponseNotContainsSystemPermissions(ApiTester $I): void
    {
        $I->wantTo('Отсутствие в ответе разрешений доски, прочих разрешений, являющихся системными');

        [$userId, $email] = $this->createUser($I, 2);
        $boardId = $this->createBoard($I, 2, $userId);

        $I->haveHttpHeader('X-BASE-AUTH', $email);

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
            $I->haveInDatabase('auth_item', [
                'name' => $permission['name'],
                'type' => $permission['type'],
            ]);
        }

        $I->sendGet("/v1/boards/$boardId/permissions");
        $I->seeResponseCodeIs(200);
        $I->dontSeeResponseContainsJson($notBoardPermission);
    }
}