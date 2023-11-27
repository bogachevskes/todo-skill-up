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

        $table = $this->table('auth_item');
        $table->insert($data)->save();
    }
}
