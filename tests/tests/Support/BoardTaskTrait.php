<?php

namespace Tests\Support;

trait BoardTaskTrait
{
    private function createBoardTask(ApiTester $I, int $boardId, int $statusId): int
    {
        if (method_exists($this, 'generateHash') === false) {
            throw new \LogicException('Отсутствует метод генерации хеша generateHash, создайте свой метод, либо используйте \Tests\Support\HashTrait');
        }

        $task = [
            'board_id' => $boardId,
            'status_id' => $statusId,
            'name' => $this->generateHash(25),
            'description' => $this->generateHash(35),
            'planned_completion_at' => '2023-12-12 00:00:00.000',
        ];

        $I->haveInDatabase('tasks', $task);

        return $I->grabFromDatabase('tasks', 'id', $task);
    }
}