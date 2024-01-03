<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateBoardsUsersRolesTable extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('boards_users_roles', [
            'id' => true,
            'primary_key' => 'id',
        ]);

        $table->addColumn('name', 'string', [
            'limit' => 25,
            'null' => false,
        ]);

        $table->addColumn('created_at', 'timestamp', [
            'default' => 'CURRENT_TIMESTAMP',
            'null' => false,
        ]);

        $table->addColumn('updated_at', 'timestamp', [
            'default' => 'CURRENT_TIMESTAMP',
            'update' => 'CURRENT_TIMESTAMP',
            'null' => false,
        ]);

        $table->create();
    }
}
