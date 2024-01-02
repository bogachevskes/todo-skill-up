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

        foreach ($data as $key => $user) {
            $existingRecord = $this->getAdapter()
                ->fetchRow("SELECT * FROM users WHERE email = \"{$user['email']}\"");

            if ($existingRecord === false) {
                continue;
            }

            unset($data[$key]);
        }

        if (empty($data) === true) {
            return;
        }

        $this->table('users')
            ->insert($data)
            ->save();
    }
}
