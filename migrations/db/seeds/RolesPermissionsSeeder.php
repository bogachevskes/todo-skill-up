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


        foreach ($data as $key => $permission) {
            $existingRecord = $this->getAdapter()
                ->fetchRow("SELECT * FROM auth_item_child WHERE parent = \"{$permission['parent']}\" AND child = \"{$permission['child']}\"");

            if ($existingRecord === false) {
                continue;
            }

            unset($data[$key]);
        }

        if (empty($data) === true) {
            return;
        }

        $this->table('auth_item_child')
            ->insert($data)
            ->save();
    }
}
