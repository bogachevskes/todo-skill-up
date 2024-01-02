<?php


use Phinx\Seed\AbstractSeed;

class BoardsUsersRolesSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * https://book.cakephp.org/phinx/0/en/seeding.html
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'owner',
            ],
        ];

        foreach ($data as $key => $role) {
            $existingRecord = $this->getAdapter()
                ->fetchRow("SELECT * FROM boards_users_roles WHERE name = \"{$role['name']}\"");

            if ($existingRecord === false) {
                continue;
            }

            unset($data[$key]);
        }

        if (empty($data) === true) {
            return;
        }

        $this->table('boards_users_roles')
            ->insert($data)
            ->save();
    }
}
