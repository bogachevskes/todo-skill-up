<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTodoUsersGroups extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('todo_users_groups', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table->addColumn('todo_group_id', 'integer', ['signed' => false])
            ->addColumn('user_id', 'integer', ['signed' => false])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('todo_group_id', 'todo_group', 'id', ['delete' => 'CASCADE'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE'])
            ->create();
    }
}
