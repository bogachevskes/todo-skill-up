import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import TodoGroup from './TodoGroup';
import User from './User';

@Entity('todo_users_groups')
export default class TodoUsersGroups extends BaseEntity
{
    @ManyToOne(_type => TodoGroup)
    todoGroup: TodoGroup;

    @ManyToOne(_type => User)
    user: User;
    
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Группа доступа',
    })
    public todoGroupId: number;

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