<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class AddObjectIdToAuthAssignment extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('auth_assignment');

        $table->addColumn('object_id', 'integer', ['signed' => false, 'null' => true, 'after' => 'user_id', 'comment' => 'Объект привязки разрешения'])
            ->update();
    }
}
