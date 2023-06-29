<?php


use Phinx\Seed\AbstractSeed;

class UsersPermissionsSeeder extends AbstractSeed
{
    public function getDependencies(): array
    {
        return [
            'UsersSeeder',
        ];
    }

    public function run(): void
    {
        $data = [
            [
                'item_name' => 'administrator',
                'user_id' => 1,
            ]
        ];

        $table = $this->table('auth_assignment');
        $table->insert($data)->save();
    }
}
