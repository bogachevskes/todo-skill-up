<?php

namespace Tests;

use Tests\Support\ApiTester;

class ApiCest 
{
    protected array $headers = [];

    public function testUserSignUp(ApiTester $I): void
    {
        $data = [
            'formData' => [
                'name'              => 'guest1',
                'email'             => 'guest1@guest.com',
                'password'          => 'secret',
                'confirm_password'  => 'secret',
            ],
        ];

        $I->wantTo('Зарегистрировать нового пользователя');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $data);

        $I->seeResponseCodeIs(200);

        $I->wantTo('Авторизация пользователя');

        $I->sendPostAsJson('/v1/auth/signin', [
            'formData' => [
                'email'    => $data['formData']['email'],
                'password' => $data['formData']['password'],
            ],
        ]);

        $I->seeResponseCodeIs(201);

        $this->headers['X-BASE-AUTH'] = $I->grabDataFromResponseByJsonPath('$.token')[0];
    }

    public function testUserPermissions(ApiTester $I): void
    {
        $I->wantTo('Получить разрешения пользователя');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->sendGet('/v1/user/1/permissions');

        $I->seeResponseCodeIs(200);

        $permissions = [];

        $I->seeResponseContainsJson($permissions);
    }

    public function testCreateBoard(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->wantTo('Проверить отсутствие задач');

        $I->sendGet('/v1/user/1/boards');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([]);

        $I->wantTo('Создать доску задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'name' => 'Проект ISD:124467',
                'description' => 'Задачи проекта ISD:124467 запроса ISBN:456568',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/user/1/boards', $data);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/user/1/boards');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);

        $I->sendGet('/v1/user/1/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testCreateBoardStatus(ApiTester $I): void
    {
        $I->wantTo('Создать статус доски задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'name' => 'На ревью',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/statuses', $data);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseContainsJson($data['formData']);

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

        $taskSchema = [
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

        $I->seeResponseIsValidOnJsonSchemaString(json_encode($taskSchema));
    }

    public function testCreateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Создать задачу доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'statusId' => 1,
                'name' => 'Реализовать авторизацию',
                'description' => 'Реализовать сервис авторизации в соответствии с корп. требованиями',
                'plannedCompletionAt' => '2023-12-12T00:00:00.000Z',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/tasks', $data);

        $I->seeResponseCodeIs(201);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testCreateBoardUser(ApiTester $I): void
    {
        $data = [
            'formData' => [
                'name'              => 'guest2',
                'email'             => 'guest2@guest.com',
                'password'          => 'secret',
                'confirm_password'  => 'secret',
            ],
        ];

        $I->wantTo('Зарегистрировать нового пользователя для добавления в доску');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $data);

        $I->seeResponseCodeIs(200);

        $I->wantTo('Авторизация пользователя');

        $I->sendPostAsJson('/v1/auth/signin', [
            'formData' => [
                'email'    => $data['formData']['email'],
                'password' => $data['formData']['password'],
            ],
        ]);

        $I->seeResponseCodeIs(201);

        $newUserToken = $I->grabDataFromResponseByJsonPath('$.token')[0];

        $I->haveHttpHeader('X-BASE-AUTH', $newUserToken);

        $I->wantTo('Проверка отсутствия доступа к доске у пользователя');

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => []
        ]);

        $I->wantTo('Создать пользователя доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                "ids" => [
                    2, 3
                ]
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/boards/1/users', $data);

        $I->seeResponseCodeIs(201);

        $I->seeResponseContainsJson([
            'users' => [
                'not_exist' => [
                    3
                ]
            ]
        ]);

        $I->sendGet('/v1/boards/1/users');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson([
            'id' => 2,
            'name' => 'guest2',
            'email' => 'guest2@guest.com',
        ]);

        $I->wantTo('Проверка наличия доступа к доске у пользователя');

        $I->haveHttpHeader('X-BASE-AUTH', $newUserToken);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);
    }

    public function testDeleteBoardUser(ApiTester $I): void
    {
        $I->wantTo('Удалить пользователя из доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->sendDelete('/v1/boards/1/users/2');

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/boards/1/users');

        $I->seeResponseCodeIs(200);

        $I->dontSeeResponseContainsJson([
            'id' => 2,
            'name' => 'guest2',
            'email' => 'guest2@guest.com',
        ]);
    }

    public function testUpdateBoardTask(ApiTester $I): void
    {
        $I->wantTo('Изменить задачу');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'statusId' => 2,
                'name' => 'Измененное имя',
                'description' => 'Измененное описание',
                'plannedCompletionAt' => '2023-12-14T00:00:00.000Z',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/boards/1/tasks/1', $data);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/tasks');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testPatchBoardTask(ApiTester $I): void
    {
        $I->wantTo('Изменить статус задачи доски');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'statusId' => 1,
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPatch('/v1/boards/1/tasks/1', $data);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/tasks');

        $updatedTask = [
            'formData' => [
                'statusId' => 1,
                'name' => 'Измененное имя',
                'description' => 'Измененное описание',
                'plannedCompletionAt' => '2023-12-14T00:00:00.000Z',
            ],
        ];

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($updatedTask['formData']);
    }

    public function testDeleteBoardTask(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->wantTo('Удалить задачу из случайной доски');

        $I->sendDelete('/v1/boards/2/tasks/1');

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

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'name' => 'Другое имя',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/boards/1/statuses/1', $data);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/boards/1/statuses');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testDeleteBoardStatus(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->wantTo('Удалить статус задачи из случайной доски');

        $I->sendDelete('/v1/boards/2/statuses/1');

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

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'name' => 'Измененное имя',
                'description' => 'Измененное описание',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/user/1/boards/1', $data);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/user/1/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testPatchBoard(ApiTester $I): void
    {
        $I->wantTo('Изменить имя доски задач');

        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $data = [
            'formData' => [
                'name' => 'Новое имя',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPatch('/v1/user/1/boards/1', $data);

        $I->seeResponseCodeIs(200);

        $I->sendGet('/v1/user/1/boards/1');

        $I->seeResponseCodeIs(200);

        $I->seeResponseContainsJson($data['formData']);
    }

    public function testDeleteBoard(ApiTester $I): void
    {
        $I->haveHttpHeader('X-BASE-AUTH', $this->headers['X-BASE-AUTH']);

        $I->wantTo('Удалить доску случайного пользователя');

        $I->sendDelete('/v1/user/71/boards/1');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ запрещен',
            'type' => 'Forbidden',
            'data' => [],
        ]);

        $I->wantTo('Удалить случайную доску');

        $I->sendDelete('/v1/user/1/boards/71');

        $I->seeResponseCodeIs(403);

        $I->seeResponseContainsJson([
            'cause' => 'Доступ к доске запрещен',
            'type' => 'Forbidden',
            'data' => []
        ]);

        $I->wantTo('Удалить доску задач');

        $I->sendDelete('/v1/user/1/boards/1');

        $I->seeResponseCodeIs(204);

        $I->sendGet('/v1/user/1/boards/1');

        $I->seeResponseCodeIs(404);
    }
}