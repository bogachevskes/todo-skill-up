<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateBoardsUsersTable extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('boards_users', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table
            ->addColumn('board_id', 'integer', ['null' => false, 'signed' => false])
            ->addColumn('user_id', 'integer', ['null' => false, 'signed' => false])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addIndex(['board_id', 'user_id'], ['unique' => true])
            ->addForeignKey('board_id', 'boards', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE'])
            ->create();
    }
}
