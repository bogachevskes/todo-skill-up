<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class UpdateAuthAssignmentTablePrimaryKey extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change(): void
    {
        $this->execute("SET FOREIGN_KEY_CHECKS=0;");
        $this->execute("ALTER TABLE auth_assignment DROP PRIMARY KEY");
        $this->execute("SET FOREIGN_KEY_CHECKS=1;");

        $this->table('auth_assignment')
            ->addIndex(['item_name', 'user_id', 'object_id'])
            ->update();
    }
}
