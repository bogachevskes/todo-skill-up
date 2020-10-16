import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import TodoStatus from './TodoStatus';
import User from './User';

@Index('idx-todo_item_name', ['name'])
@Index('idx-todo_item_description', ['description'])
@Index('idx-todo_item_planned_complition_at', ['plannedComplitionAt'])
@Index('idx-todo_item_created_at', ['createdAt'])
@Index('idx-todo_item_updated_at', ['updatedAt'])
@Entity('todo_item')
export default class TodoItem extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        primary: true,
        unsigned: true,
        comment: 'Пользователь',
    })
    userId: number;

    @Column({
        primary: true,
        unsigned: true,
        comment: 'Статус',
    })
    statusId: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 100,
    })
    public name: string;

    @Column('varchar', {
        name: 'description',
        comment: 'Описание',
        length: 255,
    })
    public description: string;

    @Column("timestamp", {
        name: 'planned_complition_at',
        comment: 'Планируемая дата выполнения',
        nullable: true,
    })
    public plannedComplitionAt: Date | null;

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

    @ManyToOne(_type => TodoStatus)
    status: TodoStatus;

    @ManyToOne(_type => User)
    user: User;

}
