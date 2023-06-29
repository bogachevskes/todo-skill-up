<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTodoStatusTable extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('todo_status', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table->addColumn('name', 'string', ['limit' => 10])
            ->addColumn('initial_default', 'integer', ['signed' => false, 'limit' => 1, 'default' => 0])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->create();
    }
}
