import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import TodoStatus from './TodoStatus';
import User from './User';
import TodoAccessGroup from './TodoAccessGroup';

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
        unsigned: true,
        comment: 'Группа доступа',
        nullable: true,
    })
    public todoAccessGroupId: number | null;

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
        name: 'planned_complition_at',
        comment: 'Планируемая дата выполнения',
        nullable: true,
    })
    public plannedComplitionAt: Date | null;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP()",
    })
    public createdAt: Date;

    @Column("timestamp", {
        name: 'updated_at',
        nullable: true,
        default: () => "CURRENT_TIMESTAMP()",
        onUpdate: "CURRENT_TIMESTAMP()"
    })
    public updatedAt: Date;

    @ManyToOne(_type => TodoAccessGroup)
    public todoAccessGroup: TodoAccessGroup;

    @ManyToOne(_type => TodoStatus)
    public status: TodoStatus;

    @ManyToOne(_type => User)
    public user: User;

}
