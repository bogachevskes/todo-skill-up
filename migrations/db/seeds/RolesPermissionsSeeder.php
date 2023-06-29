<?php


use Phinx\Seed\AbstractSeed;

class RolesPermissionsSeeder extends AbstractSeed
{
    public function getDependencies(): array
    {
        return [
            'PermissionsSeeder',
            'RolesSeeder',
        ];
    }

    public function run(): void
    {
        $data = [
            [
                'parent' => 'administrator',
                'child' => '/admin/users',
            ],
            [
                'parent' => 'administrator',
                'child' => '/admin/users/todo',
            ]
        ];

        // Вставляем данные в таблицу auth_item_child
        $table = $this->table('auth_item_child');
        $table->insert($data)->save();
    }
}
