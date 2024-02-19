<?php

namespace Tests\Support;

trait BoardPermissionsTrait
{
    private function createBoardPermission(ApiTester $I, string $permissionName): void
    {
        $permissionName = [
            'name' => $permissionName,
            'type' => 3,
        ];

        $I->haveInDatabase('auth_item', $permissionName);
    }

    private function assignPermissionToBoardUser(ApiTester $I, int $boardId, int $userId, string $permissionName): void
    {
        $permissionName = [
            'item_name' => $permissionName,
            'user_id' => $userId,
            'object_id' => $boardId,
        ];

        $I->haveInDatabase('auth_assignment', $permissionName);
    }
}