<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTaskStatusesTable extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('task_statuses', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table
            ->addColumn('board_id', 'integer', ['null' => false, 'comment' => 'Доска', 'signed' => false])
            ->addColumn('name', 'string', ['null' => false, 'limit' => 10])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('board_id', 'boards', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->create();
    }
}
