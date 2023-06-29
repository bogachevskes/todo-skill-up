import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import TodoStatus from './TodoStatus';
import User from './User';
import TodoGroup from './TodoGroup';

@Entity('todo_item')
export default class TodoItem extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Группа доступа',
        nullable: true,
    })
    public todoGroupId: number | null;

    @Column({
        unsigned: true,
        comment: 'Пользователь',
    })
    public userId: number;

    @Column({
        unsigned: true,
        comment: 'Статус',
    })
    public statusId: number;

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
        name: 'planned_completion_at',
        comment: 'Планируемая дата выполнения',
        nullable: true,
    })
    public plannedCompletionAt: Date | null;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP()",
    })
    public createdAt: Date;

    @Column("timestamp", {
        name: 'updated_at',
        nullable: false,
        default: () => "CURRENT_TIMESTAMP()",
        onUpdate: "CURRENT_TIMESTAMP()"
    })
    public updatedAt: Date;

    @ManyToOne(_type => TodoGroup)
    public todoGroup: TodoGroup;

    @ManyToOne(_type => TodoStatus)
    public status: TodoStatus;

    @ManyToOne(_type => User)
    public user: User;
}
