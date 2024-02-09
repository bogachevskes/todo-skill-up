<?php

namespace tests\integration\api\auth;

use Tests\Support\ApiTester;

class SignUpCest
{
    private array $schemas = [
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

    public function testSignupUser(ApiTester $I): void
    {
        $I->wantTo('Зарегистрировать пользователя');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => 'guest1',
                'email' => 'guest1@todo-list.com',
                'password' => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $body);
        $I->seeResponseCodeIs(200);
        $I->seeInDatabase('users', ['email' => $body['formData']['email']]);
    }

    public function testSignupFailOnEmptyEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя без e-mail');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => 'guest1',
                'password' => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnNotValidEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с невалидным e-mail');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => 'guest1',
                'email' => 'not_valid_email',
                'password' => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnTheSameEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя по существующему email');

        $data = [
            'name' => 'guest2',
            'email' => 'guest2@todo-list.com',
            'password' => 'secret',
        ];

        $I->haveInDatabase('users', $data);
        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => $data,
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnEmptyName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя без имени');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'email' => 'guest3@todo-list.com',
            'password' => 'secret',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnShortName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с именем меньше 5 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => 'tttt',
            'email' => 'guest31@todo-list.com',
            'password' => 'secret',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnTooLongName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с именем более 50 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => str_repeat('t', 51),
            'email' => 'guest32@todo-list.com',
            'password' => 'secret',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnNotValidName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с некорректным именем');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => '$pecial_Ch@racters 123 !',
            'email' => 'guest33@todo-list.com',
            'password' => 'secret',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnEmptyPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя без пароля');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => 'guest6',
            'email' => 'guest6@todo-list.com',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnShortPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с паролем меньше 5 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => 'guest6',
            'email' => 'guest6@todo-list.com',
            'password' => 'tttt',
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }

    public function testSignupFailOnTooLongPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с паролем более 50 символов');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'name' => 'guest6',
            'email' => 'guest6@todo-list.com',
            'password' => str_repeat('t', 51),
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->schemas['failScheme']));
    }
}