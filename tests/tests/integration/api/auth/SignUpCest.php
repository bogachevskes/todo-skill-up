<?php

namespace tests\integration\api\auth;

use Tests\Support\{
    ApiTester,
    FailSchemeTrait,
    HashTrait,
    UserTrait,
};

class SignUpCest
{
    use FailSchemeTrait, HashTrait, UserTrait;

    public function testSignupUser(ApiTester $I): void
    {
        $I->wantTo('Зарегистрировать пользователя');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => $this->generateHash(),
                'email' => $this->generateHash() . '@todo-list.com',
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
                'name' => $this->generateHash(),
                'password' => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnNotValidEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с невалидным e-mail');

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => $this->generateHash(),
                'email' => $this->generateHash(15),
                'password' => 'secret',
            ],
        ];

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnTheSameEmail(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя по существующему email');

        [$existingUserId, $existingUserEmail] = $this->createUser($I);

        $I->haveHttpHeader('Content-Type', 'application/json');

        $body = [
            'formData' => [
                'name' => 'any_name',
                'email' => $existingUserEmail,
                'password' => 'secret',
            ],
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnEmptyName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя без имени');

        $body = [
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => 'secret',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnShortName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с именем меньше 5 символов');

        $body = [
            'name' => $this->generateHash(4),
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => 'secret',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnTooLongName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с именем более 50 символов');

        $body = [
            'name' => $this->generateHash(51),
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => 'secret',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnNotValidName(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с некорректным именем');

        $body = [
            'name' => '$pecial_Ch@racters 123 !',
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => 'secret',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnEmptyPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя без пароля');

        $body = [
            'name' => $this->generateHash(),
            'email' => $this->generateHash() . '@todo-list.com',
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnShortPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с паролем меньше 5 символов');

        $body = [
            'name' => $this->generateHash(),
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => $this->generateHash(4),
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }

    public function testSignupFailOnTooLongPassword(ApiTester $I): void
    {
        $I->wantTo('Не пройти регистрацию пользователя с паролем более 50 символов');

        $body = [
            'name' => $this->generateHash(),
            'email' => $this->generateHash() . '@todo-list.com',
            'password' => $this->generateHash(51),
        ];

        $I->haveHttpHeader('Content-Type', 'application/json');

        $I->sendPut('/v1/auth/signup', $body);

        $I->seeResponseCodeIs(400);
        $I->seeResponseIsValidOnJsonSchemaString(json_encode($this->failScheme));
    }
}