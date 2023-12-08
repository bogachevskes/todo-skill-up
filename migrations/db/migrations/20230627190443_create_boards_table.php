<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateBoardsTable extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('boards', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table
            ->addColumn('name', 'string', ['null' => false, 'limit' => 100])
            ->addColumn('description', 'string', ['null' => true, 'limit' => 255])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->create();
    }
}
