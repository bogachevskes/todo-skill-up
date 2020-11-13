import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable, BaseEntity } from 'typeorm';

@Index('idx-todo_status_name', ['name'])
@Index('udx-users_email', ['initialDefault'], { unique: true })
@Index('idx-todo_status_created_at', ['createdAt'])
@Index('idx-todo_status_updated_at', ['updatedAt'])
@Entity('todo_status')
export default class TodoStatus extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 10,
    })
    name: string;

    @Column('tinyint', {
        name: 'initial_default',
        nullable: true,
        unsigned: true,
        comment: 'Статус по умолчанию при создании задачи',
        width: 1,
      })
    public initialDefault: number;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP(3)",
    })
    public createdAt: Date;

    @Column("timestamp", {
        name: 'updated_at',
        precision: 3,
        default: () => "CURRENT_TIMESTAMP(3)",
        onUpdate: "CURRENT_TIMESTAMP(3)"
    })
    public updatedAt: Date;

}
