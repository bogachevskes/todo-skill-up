<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateRbacTables extends AbstractMigration
{

    public function change(): void
    {
        $this->table('auth_rule', [
            'id' => false,
            'primary_key' => 'name',
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ])
        ->addColumn('name', 'string', ['limit' => 64, 'null' => false])
        ->addColumn('data', 'binary', ['null' => true])
        ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
        ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
        ->create();

        $this->table('auth_item', [
            'id' => false,
            'primary_key' => 'name',
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ])
        ->addColumn('name', 'string', ['limit' => 64, 'null' => false])
        ->addColumn('type', 'integer', ['null' => false])
        ->addColumn('description', 'text', ['null' => true])
        ->addColumn('rule_name', 'string', ['limit' => 64, 'null' => true])
        ->addColumn('data', 'binary', ['null' => true])
        ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
        ->addColumn('updated_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP', 'update' => 'CURRENT_TIMESTAMP'])
        ->addForeignKey('rule_name', 'auth_rule', 'name', ['delete' => 'SET NULL', 'update' => 'CASCADE'])
        ->create();

        $this->table('auth_item')
            ->addIndex('type', ['name' => 'idx-auth_item-type'])
            ->update();

        $this->table('auth_item_child', [
            'id' => false,
            'primary_key' => ['parent', 'child'],
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ])
        ->addColumn('parent', 'string', ['limit' => 64, 'null' => false])
        ->addColumn('child', 'string', ['limit' => 64, 'null' => false])
        ->addForeignKey('parent', 'auth_item', 'name', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
        ->addForeignKey('child', 'auth_item', 'name', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
        ->create();

        $this->table('auth_assignment', [
            'id' => false,
            'primary_key' => ['item_name', 'user_id'],
            'engine' => 'InnoDB',
            'collation' => 'utf8_unicode_ci',
            'charset' => 'utf8',
        ])
        ->addColumn('item_name', 'string', ['limit' => 64, 'null' => false])
        ->addColumn('user_id', 'integer', ['signed' => false])
        ->addColumn('created_at', 'timestamp', ['null' => false, 'default' => 'CURRENT_TIMESTAMP'])
        ->addForeignKey('user_id', 'users', 'id', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
        ->addForeignKey('item_name', 'auth_item', 'name', ['delete' => 'CASCADE', 'update' => 'CASCADE'])
        ->create();
    }
}
