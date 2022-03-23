import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import TodoAccessGroup from './TodoAccessGroup';
import User from './User';

@Index('udx-access_group_user_group', ['todoAccessGroupId', 'userId'], { unique: true })
@Entity('todo_access_user_group')
export default class TodoAccessUserGroup extends BaseEntity
{
    @ManyToOne(_type => TodoAccessGroup, { onDelete: 'CASCADE' })
    todoAccessGroup: TodoAccessGroup;

    @ManyToOne(_type => User, { onDelete: 'CASCADE' })
    user: User;
    
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Группа доступа',
    })
    public todoAccessGroupId: number;

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