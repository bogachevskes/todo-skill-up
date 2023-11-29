<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTasksTable extends AbstractMigration
{
    public function change(): void
    {
        $table = $this->table('tasks');
        $table
            ->addColumn('board_id', 'integer', ['null' => false, 'comment' => 'Доска', 'signed' => false])
            ->addColumn('status_id', 'integer', ['null' => false, 'comment' => 'Статус', 'signed' => false])
            ->addColumn('name', 'string', ['null' => false, 'length' => 100, 'comment' => 'Имя'])
            ->addColumn('description', 'string', ['null' => true, 'length' => 255, 'comment' => 'Описание'])
            ->addColumn('planned_completion_at', 'timestamp', ['null' => true, 'comment' => 'Планируемая дата выполнения'])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('board_id', 'boards', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->addForeignKey('status_id', 'task_statuses', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->create();
    }
}
