<?php

namespace Tests\Support;

trait UserBoardTrait
{
    private function createBoard(ApiTester $I, int $userId): int
    {
        if (method_exists($this, 'generateHash') === false) {
            throw new \LogicException('Отсутствует метод генерации хеша generateHash, создайте свой метод, либо используйте \Tests\Support\HashTrait');
        }

        $board = [
            'name' => $this->generateHash(25),
            'description' => $this->generateHash(35),
        ];

        $I->haveInDatabase('boards', $board);

        return $I->grabFromDatabase('boards', 'id', $board);
    }

    private function assignUserToBoardAsOwner(ApiTester $I, int $boardId, int $userId): void
    {
        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $userId,
            'role_id' => 1,
        ];

        $I->haveInDatabase('boards_users', $boardUser);
    }

    private function assignUserToBoard(ApiTester $I, int $boardId, int $userId): void
    {
        $boardUser = [
            'board_id' => $boardId,
            'user_id' => $userId,
        ];

        $I->haveInDatabase('boards_users', $boardUser);
    }
}