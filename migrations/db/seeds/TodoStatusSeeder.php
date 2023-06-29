<?php


use Phinx\Seed\AbstractSeed;

class TodoStatusSeeder extends AbstractSeed
{

    public function run(): void
    {
        $data = [
            [
                'name' => 'Новое',
                'initial_default' => 1,
            ],
            [
                'name' => 'В работе',
            ],
            [
                'name' => 'Отменено',
            ],
        ];

        $table = $this->table('todo_status');
        $table->insert($data)->save();
    }
}
