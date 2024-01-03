<?php


use Phinx\Seed\AbstractSeed;

class BoardPermissionsSeeder extends AbstractSeed
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'manage-board',
                'type' => 3,
                'description' => 'Управление доской',
            ],
            [
                'name' => 'delete-board',
                'type' => 3,
                'description' => 'Удаление доски',
            ],
            [
                'name' => 'manage-board-statuses',
                'type' => 3,
                'description' => 'Управление статусами доски',
            ],
            [
                'name' => 'delete-board-statuses',
                'type' => 3,
                'description' => 'Удаление статусов доски',
            ],
            [
                'name' => 'manage-board-users',
                'type' => 3,
                'description' => 'Управление пользователями доски',
            ],
        ];

        foreach ($data as $key => $permission) {
            $existingRecord = $this->getAdapter()
                ->fetchRow("SELECT * FROM auth_item WHERE name = \"{$permission['name']}\"");

            if ($existingRecord === false) {
                continue;
            }

            unset($data[$key]);
        }

        if (empty($data) === true) {
            return;
        }

        $this->table('auth_item')
            ->insert($data)
            ->save();
    }
}
