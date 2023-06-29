<?php


use Phinx\Seed\AbstractSeed;

class UsersSeeder extends AbstractSeed
{

    public function run(): void
    {
        $data = [
            [
                'name' => 'admin',
                'email' => 'admin@admin.com',
                'password' => '$2a$12$lAR1FHRxNOQWADxnhmQQk.RpHpTsO61h36VXnE4z2G8m1M5/481jK',
            ],
        ];

        $table = $this->table('users');
        $table->insert($data)->save();
    }
}
