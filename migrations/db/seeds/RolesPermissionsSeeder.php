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
            ]
        ];

        $table = $this->table('auth_item_child');
        $table->insert($data)->save();
    }
}
