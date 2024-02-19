<?php

namespace tests\integration\api\auth;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    UserTrait,
    HashTrait,
};

class SignInCest
{
    use FailSchemeTrait, UserTrait, HashTrait;

    public function testSignInSucceed(ApiTester $I): void
    {
        $I->wantTo('Успешно аутентифицировать пользователя');

        [$onSignInUserId, $onSignInUserEmail] = $this->createUser($I);

        $body = [
            'formData' => [
                'email' => $onSignInUserEmail,
                'password' => 'secret',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

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
        $I->wantTo('Не пройти аутентификацию несуществующего пользователя');

        $body = [
            'formData' => [
                'email' => $this->generateHash() . '@todo-list.com',
                'password' => 'secret',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
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
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignInFailOnNotValidEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с невалидным e-mail');

        $body = [
            'formData' => [
                'email' => $this->generateHash(),
                'password' => 'secret',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnEmptyPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя без пароля');

        $body = [
            'email' => $this->generateHash() . '@todo-list.com',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnShortPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с паролем меньше 5 символов');

        $body = [
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => $this->generateHash(4),
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnTooLongPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти аутентификацию пользователя с паролем более 50 символов');

        $body = [
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => $this->generateHash(51),
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPost('/v1/auth/signin', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}