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

        $table = $this->table('auth_item');
        $table->insert($data)->save();
    }
}
