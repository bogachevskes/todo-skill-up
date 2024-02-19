<?php

namespace Tests\Support;

trait BoardStatusTrait
{
    private function createBoardStatus(ApiTester $I, int $boardId): int
    {
        if (method_exists($this, 'generateHash') === false) {
            throw new \LogicException('Отсутствует метод генерации хеша generateHash, создайте свой метод, либо используйте \Tests\Support\HashTrait');
        }

        $status = [
            'board_id' => $boardId,
            'name' => $this->generateHash(),
        ];

        $I->haveInDatabase('task_statuses', $status);

        return $I->grabFromDatabase('task_statuses', 'id', $status);
    }
}