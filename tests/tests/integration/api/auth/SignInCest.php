<?php

namespace tests\integration\api\auth;

use Tests\Support\ApiTester;

// протестировано
class SignInCest
{
    protected array $schemas = [
        'failScheme' => [
            'type' => 'object',
            'properties' => [
                'cause' => ['type' => 'string'],
                'type' => ['type' => 'string'],
                'data' => ['type' => 'array'],
            ],
            'required' => ['cause', 'type', 'data'],
            'additionalProperties' => false,
        ],
    ];

    public function testSignInSucceed(ApiTester $I): void
    {
        $I->wantTo('Успешно аутентифицировать пользователя');

        $data = [
            'name' => 'guest10',
            'email' => 'guest10@todo-list.com',
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $data);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'email' => $data['email'],
                'password' => 'secret',
            ],
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(201);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode([
            'type' => 'object',
            'properties' => [
                'token' => ['type' => 'string'],
                'userId' => ['type' => 'integer'],
            ],
            'required' => ['token', 'userId'],
            'additionalProperties' => false,
        ]));
    }

    public function testSignInFailOnNotExistingUser(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'email' => 'guest341@todo-list.com',
                'password' => 'user_not_exist',
            ],
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignInFailOnEmptyEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя без e-mail');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'password' => 'secret',
            ],
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignInFailOnNotValidEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с невалидным e-mail');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'email' => 'not_valid_email',
                'password' => 'secret',
            ],
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnEmptyPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя без пароля');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'email' => 'guest6@todo-list.com',
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnShortPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с паролем меньше 5 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'email' => 'guest6@todo-list.com',
            'password' => 'tttt',
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnTooLongPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с паролем более 50 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'email' => 'guest6@todo-list.com',
            'password' => str_repeat('t', 51),
        ];

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }
}