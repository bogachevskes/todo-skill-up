<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class ChangeTaskStatusNameLength extends AbstractMigration
{
    public function change(): void
    {
        $table = $this->table('task_statuses');

        $table->changeColumn('name', 'string', ['limit' => 25]);

        $table->update();
    }
}
