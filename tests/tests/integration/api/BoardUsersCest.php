<?php

namespace tests\integration\api;

use Tests\Support\ApiTester;

class BoardUsersCest
{
    private function createUser(ApiTester $I, int $nameId): array
    {
        $user = [
            'name' => "boardUsersCestGuest$nameId",
            'email' => "board.users.cest.guest$nameId@todo-list.com",
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
            'name' => "board users cest name $nameId",
            'description' => "board users cest description $nameId",
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


    public function testAddUserToBoard(ApiTester $I): void
    {
        $I->wantTo('Добавить пользователя в доску');

        [$userId, $email] = $this->createUser($I, 1);

        [$newUserId] = $this->createUser($I, 111);

        $boardId = $this->createBoard($I, 1, $userId);

        $body = [
            'formData' => [
                'ids' => [
                    $newUserId,
                ]
            ],
        ];

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(201);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ]);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $newUserId,
            'role_id' => null,
        ]);
    }

    public function testAddUsersWithNotExistingUser(ApiTester $I): void
    {
        $I->wantTo('Добавить пользователей в доску, в том числе, несуществующего пользователя');

        [$userId, $email] = $this->createUser($I, 2);

        [$newUserId] = $this->createUser($I, 222);

        $boardId = $this->createBoard($I, 2, $userId);

        $randomUserId = 123456;

        $body = [
            'formData' => [
                'ids' => [
                    $newUserId,
                    $randomUserId,
                ]
            ],
        ];

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost("/v1/boards/$boardId/users", $body);

        $I->seeResponseCodeIs(201);
        $I->seeResponseContainsJson([
            'users' => [
                'not_exist' => [
                    $randomUserId,
                ]
            ]
        ]);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ]);

        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $newUserId,
            'role_id' => null,
        ]);

        $I->dontSeeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $randomUserId,
        ]);
    }

    public function testBoardUsersSchema(ApiTester $I): void
    {
        $I->wantTo('Проверить контракт ответа пользователей доски');

        [$userId, $email] = $this->createUser($I, 3);

        $boardId = $this->createBoard($I, 3, $userId);

        [$newUserId] = $this->createUser($I, 333);

        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $newUserId,
        ];

        $I->haveInDatabase('boards_users', $boardUser);

        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendGet("/v1/boards/$boardId/users");

        $I->seeResponseCodeIs(200);
        $I->seeResponseMatchesJsonType([
            'id' => 'integer',
            'name' => 'string',
            'email' => 'string',
        ]);
    }

    public function testDeleteBoardUser(ApiTester $I): void
    {
        $I->wantTo('Удалить пользователя из доски');

        [$userId, $email] = $this->createUser($I, 3);

        [$newUserId] = $this->createUser($I, 333);

        $boardId = $this->createBoard($I, 3, $userId);

        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $newUserId,
        ];

        $I->haveInDatabase('boards_users', $boardUser);
        $I->haveHttpHeader('X-BASE-AUTH', $email);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendDelete("/v1/boards/$boardId/users/$newUserId");
        $I->seeResponseCodeIs(204);
        $I->seeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ]);
        $I->dontSeeInDatabase('boards_users', [
            'board_id' => $boardId,
            'user_id' => $newUserId,
        ]);
    }
}