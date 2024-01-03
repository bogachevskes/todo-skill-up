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

        foreach ($data as $key => $assignment) {
            $existingRecord = $this->getAdapter()
                ->fetchRow("SELECT * FROM auth_assignment WHERE item_name = \"{$assignment['item_name']}\" AND user_id = \"{$assignment['user_id']}\"");

            if ($existingRecord === false) {
                continue;
            }

            unset($data[$key]);
        }

        if (empty($data) === true) {
            return;
        }

        $this->table('auth_assignment')
            ->insert($data)
            ->save();
    }
}
