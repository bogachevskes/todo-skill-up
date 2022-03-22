import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index } from 'typeorm';
import User from './User';
import TodoAccessUserGroup from './TodoAccessUserGroup';

@Index('idx-todo_item_name', ['name'])
@Index('idx-todo_item_created_at', ['createdAt'])
@Index('idx-todo_item_updated_at', ['updatedAt'])
@Entity('todo_access_group')
export default class TodoAccessGroup extends BaseEntity
{
    @ManyToOne(_type => User, { onDelete: 'CASCADE' })
    public user: User;

    @OneToMany(() => TodoAccessUserGroup, todoAccessUserGroup => todoAccessUserGroup.user)
    public users:  User[];
    
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Пользователь',
    })
    public userId: number;

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
}