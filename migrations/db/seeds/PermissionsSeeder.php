<?php


use Phinx\Seed\AbstractSeed;

class PermissionsSeeder extends AbstractSeed
{

    public function run(): void
    {
        $data = [
            [
                'name' => '/admin/users',
                'type' => 2,
                'description' => 'Управление пользователями',
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
