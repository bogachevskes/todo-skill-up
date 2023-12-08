<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateUsersTable extends AbstractMigration
{

    public function change(): void
    {
        $table = $this->table('users', [
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ]);

        $table
            ->addColumn('name', 'string', ['limit' => 50])
            ->addColumn('email', 'string', ['limit' => 50])
            ->addColumn('password', 'string', ['limit' => 100])
            ->addColumn('status', 'integer', ['signed' => false, 'limit' => 1, 'default' => 1])
            ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
            ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
            ->addColumn('deleted_at', 'timestamp', ['null' => true, 'default' => null])
            ->addIndex(['email'], ['unique' => true])
            ->create();
    }
}
