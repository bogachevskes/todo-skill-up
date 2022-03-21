import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import TodoAccessGroup from './TodoAccessUserGroup';
import User from './User';

@Entity('todo_access_user_group')
export default class TodoAccessUserGroup extends BaseEntity
{
    @ManyToOne(_type => TodoAccessGroup)
    todoAccessGroups: TodoAccessGroup;

    @ManyToOne(_type => User)
    users: User;
    
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Группа доступа',
    })
    public todoAccessGroupsId: number;

    @Column({
        unsigned: true,
        comment: 'Пользователь',
    })
    public userId: number;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP()",
    })
    public createdAt: Date;
}