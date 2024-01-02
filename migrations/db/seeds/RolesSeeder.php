<?php


use Phinx\Seed\AbstractSeed;

class RolesSeeder extends AbstractSeed
{

    public function run(): void
    {
        $data = [
            [
                'name' => 'user',
                'type' => 1,
                'description' => 'Пользователь',
            ],
            [
                'name' => 'administrator',
                'type' => 1,
                'description' => 'Администратор',
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
