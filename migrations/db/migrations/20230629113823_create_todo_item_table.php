<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateTodoItemTable extends AbstractMigration
{
    public function change(): void
    {
        $table = $this->table('todo_item');
        $table->addColumn('todo_group_id', 'integer', ['null' => true, 'comment' => 'Группа доступа', 'signed' => false])
            ->addColumn('user_id', 'integer', ['comment' => 'Пользователь', 'signed' => false])
            ->addColumn('status_id', 'integer', ['comment' => 'Статус', 'signed' => false])
            ->addColumn('name', 'string', ['length' => 100, 'comment' => 'Имя'])
            ->addColumn('description', 'string', ['length' => 255, 'comment' => 'Описание'])
            ->addColumn('planned_completion_at', 'timestamp', ['null' => true, 'comment' => 'Планируемая дата выполнения'])
            ->addColumn('created_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->addForeignKey('todo_group_id', 'todo_group', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
            ->addForeignKey('status_id', 'todo_status', 'id', ['delete' => 'NO_ACTION', 'update' => 'CASCADE'])
            ->create();
    }
}
