<?php

namespace Tests;

use Tests\Support\ApiTester;

class ApiCest 
{
    private bool $setUpDone = false;

    protected array $data = [
        'actors' => [
            'owner' => [
                'email' => null,
                'token' => null,
                'user_id' => null,
            ],
            'guest' => [
                'email' => null,
                'token' => null,
                'user_id' => null,
            ],
            'invited_guest' => [
                'email' => null,
                'token' => null,
                'user_id' => null,
            ],
        ],
    ];

    private function signupAndSignInBoardOwner(ApiTester $I): void
    {
        $I->wantTo('Зарегистрировать нового пользователя - владельца доски');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $data = [
            'formData' => [
                'name'              => 'guest1',
                'email'             => 'guest1@guest.com',
                'password'          => 'secret',
                'confirm_password'  => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $data);

        $I->seeResponseCodeIs(200);

        $I->wantTo('Авторизовать пользователя - владельца доски');

        $I->sendPostAsJson('/v1/auth/signin', [
            'formData' => [
                'email'    => $data['formData']['email'],
                'password' => $data['formData']['password'],
            ],
        ]);

        $I->seeResponseCodeIs(201);

        $this->data['actors']['owner']['email'] = $data['formData']['email'];

        $this->data['actors']['owner']['token'] = $I->grabDataFromResponseByJsonPath('$.token')[0];

        $this->data['actors']['owner']['user_id'] = $I->grabDataFromResponseByJsonPath('$.userId')[0];
    }

    private function signupAndSignInBoardGuest(ApiTester $I): void
    {
        $I->wantTo('Зарегистрировать нового пользователя для приглашения в доску');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $data = [
            'formData' => [
                'name'              => 'guest2',
                'email'             => 'guest2@guest.com',
                'password'          => 'secret',
                'confirm_password'  => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $data);

        $I->seeResponseCodeIs(200);

        $I->wantTo('Авторизовать пользователя, приглашаемого в доску');

        $I->sendPostAsJson('/v1/auth/signin', [
            'formData' => [
                'email'    => $data['formData']['email'],
                'password' => $data['formData']['password'],
            ],
        ]);

        $I->seeResponseCodeIs(201);

        $this->data['actors']['guest']['email'] = $data['formData']['email'];

        $this->data['actors']['guest']['token'] = $I->grabDataFromResponseByJsonPath('$.token')[0];

        $this->data['actors']['guest']['user_id'] = $I->grabDataFromResponseByJsonPath('$.userId')[0];
    }

    private function signupAndSignInBoardGuestInvitedByGuest(ApiTester $I): void
    {
        $I->wantTo('Зарегистрировать нового пользователя для приглашения в доску приглашенным пользователем');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $data = [
            'formData' => [
                'name'              => 'guest3',
                'email'             => 'guest3@guest.com',
                'password'          => 'secret',
                'confirm_password'  => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $data);

        $I->seeResponseCodeIs(200);

        $I->wantTo('Авторизовать пользователя, приглашаемого в доску');

        $I->sendPostAsJson('/v1/auth/signin', [
            'formData' => [
                'email'    => $data['formData']['email'],
                'password' => $data['formData']['password'],
            ],
        ]);

        $I->seeResponseCodeIs(201);

        $this->data['actors']['invited_guest']['email'] = $data['formData']['email'];

        $this->data['actors']['invited_guest']['token'] = $I->grabDataFromResponseByJsonPath('$.token')[0];

        $this->data['actors']['invited_guest']['user_id'] = $I->grabDataFromResponseByJsonPath('$.userId')[0];
    }

    public function _before(ApiTester $I): void
    {
        if ($this->setUpDone === true) {
            return;
        }

        $this->signupAndSignInBoardOwner($I);
        $this->signupAndSignInBoardGuest($I);
        $this->signupAndSignInBoardGuestInvitedByGuest($I);

        $this->data['board'] = [
            'create' => [
                'formData' => [
                    'name' => 'Проект ISD:124467',
                    'description' => 'Задачи проекта ISD:124467 запроса ISBN:456568',
                ]
            ],
            'update' => [
                'formData' => [
                    'name' => 'Измененное имя',
                    'description' => 'Измененное описание',
                ],
            ],
            'patch' => [
                'formData' => [
                    'name' => 'Новое имя',
                ],
            ],
        ];

        $this->data['boardStatus'] = [
            'create' => [
                'formData' => [
                    'name' => 'На ревью',
                ],
            ],
            'update' => [
                'formData' => [
                    'name' => 'Другое имя',
                ],
            ],
        ];

        $this->data['taskSchema'] = [
            'type' => 'array',
            'items' => [
                'type' => 'object',
                'properties' => [
                    'status' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer'],
                            'boardId' => ['type' => 'integer'],
                            'name' => ['type' => 'string']
                        ],
                        'required' => ['id', 'boardId', 'name']
                    ],
                    'tasks' => ['type' => 'array']
                ],
                'required' => ['status', 'tasks']
            ]
        ];

        $this->data['task'] = [
            'create' => [
                'formData' => [
                    'statusId' => 1,
                    'name' => 'Реализовать авторизацию',
                    'description' => 'Реализовать сервис авторизации в соответствии с корп. требованиями',
                    'plannedCompletionAt' => '2023-12-12T00:00:00.000Z',
                ],
            ],
            'update' => [
                'formData' => [
                    'statusId' => 2,
                    'name' => 'Измененное имя',
                    'description' => 'Измененное описание',
                    'plannedCompletionAt' => '2023-12-14T00:00:00.000Z',
                ],
            ],
            'patch' => [
                'formData' => [
                    'statusId' => 1,
                ],
            ],
        ];

        $this->data['boardPermissions'] = [
            'BOARD_MANAGE' => 'manage-board',
            'BOARD_DELETE' => 'delete-board',
            'BOARD_STATUSES_MANAGE' => 'manage-board-statuses',
            'BOARD_STATUS_DELETE' => 'delete-board-statuses',
            'BOARD_USERS_MANAGE' => 'manage-board-users',
        ];

        $this->data['randomBoardId'] = mt_rand(300, 700);

        $this->data['randomTaskId'] = mt_rand(300, 700);

        $this->setUpDone = true;
    }

    public function testUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Получить разрешения пользователя');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/permissions');

        $I->seeResponseCodeIs(200);

        $permissions = [];

        $I->seeResponseContainsJson($permissions);
    }

    public function testCreateBoard(ApiTester $I): void
    {
        $I->wantTo('Проверить отсутствие задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([]);

        $I->wantTo('Создать доску задач');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards', $this->data['board']['create']);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([
            [
                ...$this->data['board']['create']['formData'],
                'owner' => [
                    'email' => $this->data['actors']['owner']['email'],
                ]
            ],
        ]);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([
            ...$this->data['board']['create']['formData'],
            'owner' => [
                'email' => $this->data['actors']['owner']['email'],
            ]
        ]);
    }

    public function testCreateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Создать статус доски задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/statuses', $this->data['boardStatus']['create']);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseContainsJson($this->data['boardStatus']['create']['formData']);

        $I->wantTo('Создать дополнительный статус доски задач пользователя');

        $data = [
            'formData' => [
                'name' => 'В работе',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/statuses', $data);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->data['taskSchema']));
    }

    public function testCreateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Создать задачу доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/tasks',  $this->data['task']['create']);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($this->data['task']['create']['formData']);
    }

    public function testCreateBoardUser(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['guest']['token']);

        $I->wantTo('Проверка отсутствия доступа к доске у пользователя');

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => []
        ]);

        $I->wantTo('Создать пользователя доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $this->data['randomUserId'] = mt_rand(300, 700);

        $data = [
            'formData' => [
                'ids' => [
                    $this->data['actors']['guest']['user_id'], $this->data['randomUserId']
                ]
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/users', $data);

        $I->seeResponseCodeIs(201);

        $I->seeResponseContainsJson([
            'users' => [
                'not_exist' => [
                    $this->data['randomUserId']
                ]
            ]
        ]);

        $I->sendGet('/v1/boards/1/users');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([
            'id' => $this->data['actors']['guest']['user_id'],
            'name' => 'guest2',
            'email' => 'guest2@guest.com',
        ]);

        $I->wantTo('Проверка наличия доступа к доске у пользователя');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['guest']['token']);

        $I->sendGet('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([
            ...$this->data['board']['create']['formData'],
            'owner' => [
                'email' => $this->data['actors']['owner']['email'],
            ]
        ]);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);
    }

    public function testDeleteBoardUser(ApiTester $I): void
    {
        $I->wantTo('Удалить пользователя из доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->sendDelete('/v1/boards/1/users/' . $this->data['actors']['guest']['user_id']);

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/boards/1/users');

        $I->seeResponseCodeIs(200);

        $I->dontSeeResponseContainsJson([
            'id' => $this->data['actors']['guest']['user_id'],
            'name' => 'guest2',
            'email' => 'guest2@guest.com',
        ]);
    }

    public function testUpdateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Изменить задачу');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/boards/1/tasks/1', $this->data['task']['update']);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($this->data['task']['update']['formData']);
    }

    public function testPatchBoardTask(ApiTester $I): void
    {
        $I->wantTo('Изменить статус задачи доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPatch('/v1/boards/1/tasks/1', $this->data['task']['patch']);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/tasks');

        $updatedTask = $this->data['task']['update'];

        $updatedTask['formData']['statusId'] = $this->data['task']['patch']['formData']['statusId'];

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($updatedTask['formData']);
    }

    public function testDeleteBoardTask(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->wantTo('Удалить задачу из случайной доски');

        $I->sendDelete('/v1/boards/' . $this->data['randomBoardId'] . '/tasks/1');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => [],
        ]);

        $I->wantTo('Удалить случайную задачу из доски');

        $I->sendDelete('/v1/boards/1/tasks/2');

        $I->seeResponseCodeIs(404);

        $I->seeResponseContainsJson([
            'cause' => 'Задача не найдена',
            'type' => 'NotFound',
            'data' => []
        ]);

        $I->wantTo('Удалить задачу из доски');

        $I->sendDelete('/v1/boards/1/tasks/1');

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->dontSeeResponseContainsJson([
            'statusId' => 1,
            'name' => 'Измененное имя',
            'description' => 'Измененное описание',
            'plannedCompletionAt' => '2023-12-14T00:00:00.000Z',
        ]);
    }

    public function testUpdateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Изменить статус задач доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/boards/1/statuses/1', $this->data['boardStatus']['update']);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($this->data['boardStatus']['update']['formData']);
    }

    public function testDeleteBoardStatus(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->wantTo('Удалить статус задачи из случайной доски');

        $I->sendDelete('/v1/boards/' . $this->data['randomBoardId'] . '/statuses/1');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => [],
        ]);

        $I->wantTo('Удалить случайный статус задачи из доски');

        $I->sendDelete('/v1/boards/1/statuses/3');

        $I->seeResponseCodeIs(404);

        $I->seeResponseContainsJson([
            'cause' => 'Статус не найден в доске задач',
            'type' => 'NotFound',
            'data' => []
        ]);

        $I->wantTo('Удалить статус задач доски');

        $I->sendDelete('/v1/boards/1/statuses/1');

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseCodeIs(200);

        $I->dontSeeResponseContainsJson([
            'name' => 'Другое имя',
        ]);
    }

    public function testUpdateBoard(ApiTester $I): void
    {
        $I->wantTo('Изменить доску задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1', $this->data['board']['update']);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($this->data['board']['update']['formData']);
    }

    public function testPatchBoard(ApiTester $I): void
    {
        $I->wantTo('Изменить имя доски задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPatch('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1', $this->data['board']['patch']);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($this->data['board']['patch']['formData']);
    }

    public function testDeleteBoard(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->wantTo('Удалить доску случайного пользователя');

        $I->sendDelete('/v1/user/' . $this->data['randomUserId'] . '/boards/1');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ запрещен',
            'type' => 'Forbidden',
            'data' => [],
        ]);

        $I->wantTo('Удалить случайную доску');

        $I->sendDelete('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/' . $this->data['randomBoardId']);

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => []
        ]);

        $I->wantTo('Удалить доску задач');

        $I->sendDelete('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards/1');

        $I->seeResponseCodeIs(403);
    }

    public function testBoardsUsersPermissions(ApiTester $I): void
    {
        $I->wantTo('Проверить корректность работы разрешений доски пользователей');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->wantTo('Создать доску');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/user/' . $this->data['actors']['owner']['user_id'] . '/boards', $this->data['board']['create']);

        $boardId = 2;

        $I->wantTo('Создать статус доски');

        $I->sendPost('/v1/boards/' . $boardId . '/statuses', $this->data['boardStatus']['create']);

        $I->wantTo('Добавить пользователя в доску');

        $addGuestFormData = [
            'formData' => [
                'ids' => [
                    $this->data['actors']['guest']['user_id'],
                ],
            ],
        ];

        $I->sendPost('/v1/boards/' . $boardId . '/users', $addGuestFormData);

        $I->wantTo('Проверить разрешения владельца доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        $I->sendGet('v1/boards/' . $boardId . '/permissions');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson(array_values($this->data['boardPermissions']));

        $I->wantTo('Проверить отсутствие разрешений приглашенного пользователя доски');

        $I->sendGet('v1/boards/' . $boardId . '/users/' . $this->data['actors']['guest']['user_id'] . '/permissions');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([]);

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['guest']['token']);

        $I->sendPost('/v1/boards/' . $boardId . '/statuses', $this->data['boardStatus']['create']);

        $I->seeResponseCodeIs(403);

        $I->sendPut('/v1/boards/' . $boardId . '/statuses/3', $this->data['boardStatus']['update']);

        $I->seeResponseCodeIs(403);

        $I->sendDelete('/v1/boards/' . $boardId . '/statuses/3');

        $I->seeResponseCodeIs(403);

        $I->sendPut('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId, $this->data['board']['update']);

        $I->seeResponseCodeIs(403);

        $I->sendPatch('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId, $this->data['board']['patch']);

        $I->seeResponseCodeIs(403);

        $I->sendDelete('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId);

        $I->seeResponseCodeIs(403);

        $inviteGuestFormData = [
            'formData' => [
                'ids' => [
                    $this->data['actors']['invited_guest']['user_id'],
                ],
            ],
        ];

        $I->sendPost('/v1/boards/' . $boardId . '/users', $inviteGuestFormData);

        $I->seeResponseCodeIs(403);

        $I->sendDelete('/v1/boards/' . $boardId . '/users/' . $this->data['actors']['invited_guest']['user_id']);

        $I->seeResponseCodeIs(403);

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['owner']['token']);

        foreach ($this->data['boardPermissions'] as $permission) {
            $I->sendPut('/v1/boards/' . $boardId . '/users/' .
                $this->data['actors']['guest']['user_id']
                . '/permissions/' . $permission);

            $I->seeResponseCodeIs(200);
        }

        $I->haveHttpHeader('X-BASE-AUTH', $this->data['actors']['guest']['token']);

        $I->sendPost('/v1/boards/' . $boardId . '/users', $inviteGuestFormData);

        $I->seeResponseCodeIs(201);

        $I->sendPut('/v1/boards/' . $boardId . '/users/' .
            $this->data['actors']['invited_guest']['user_id']
            . '/permissions/' . $this->data['boardPermissions']['BOARD_MANAGE']);

        $I->seeResponseCodeIs(200);

        $I->sendDelete('/v1/boards/' . $boardId . '/users/' . $this->data['actors']['invited_guest']['user_id']);

        $I->seeResponseCodeIs(204);

        $I->sendPost('/v1/boards/' . $boardId . '/statuses', $this->data['boardStatus']['create']);

        $I->seeResponseCodeIs(201);

        $I->sendPut('/v1/boards/' . $boardId . '/statuses/4', $this->data['boardStatus']['update']);

        $I->seeResponseCodeIs(200);

        $I->sendDelete('/v1/boards/' . $boardId . '/statuses/4');

        $I->seeResponseCodeIs(204);

        $I->sendPut('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId, $this->data['board']['update']);

        $I->seeResponseCodeIs(200);

        $I->sendPatch('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId, $this->data['board']['patch']);

        $I->seeResponseCodeIs(200);

        $I->sendDelete('/v1/user/' . $this->data['actors']['guest']['user_id'] . '/boards/' . $boardId);

        $I->seeResponseCodeIs(204);
    }
}