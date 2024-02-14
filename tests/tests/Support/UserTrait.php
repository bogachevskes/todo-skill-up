<?php

namespace Tests\Support;

trait UserTrait
{
    private function createUser(ApiTester $I): array
    {
        if (method_exists($this, 'generateHash') === false) {
            throw new \LogicException('Отсутствует метод генерации хеша generateHash, создайте свой метод, либо используйте \Tests\Support\HashTrait');
        }

        $user = [
            'name' => $this->generateHash(15),
            'email' => "{$this->generateHash()}@todo-list.com",
            'password' => base64_encode('secret'),
        ];

        $I->haveInDatabase('users', $user);

        $userId = $I->grabFromDatabase('users', 'id', $user);

        return [
            $userId,
            $user['email'],
        ];
    }
}