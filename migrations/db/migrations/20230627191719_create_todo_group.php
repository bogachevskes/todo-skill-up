<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTodoGroup extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('todo_group', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table->addColumn('user_id', 'integer', ['signed' => false])
            ->addColumn('name', 'string', ['limit' => 100])
            ->addColumn('description', 'string', ['limit' => 255])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => true, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE'])
            ->create();
    }
}
