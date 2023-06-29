import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import TodoUsersGroups from './TodoUsersGroups';

@Entity('users')
export default class User extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 50,
    })
    public name: string;

    @Column('varchar', {
        name: 'email',
        comment: 'Почта',
        length: 50,
    })
    public email: string;

    @Column('varchar', {
        name: 'password',
        comment: 'Пароль',
        length: 100,
    })
    public password: string;

    @Column('tinyint', {
        name: 'status',
        nullable: true,
        unsigned: true,
        comment: 'Статус активности',
        width: 1,
        default: () => "'1'",
      })
    public status: number;

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

    @Column("timestamp", {
        name: 'deleted_at',
        nullable: true,
    })
    public deletedAt: Date | null;

    @OneToMany(() => TodoUsersGroups, todoUsersGroups => todoUsersGroups.user)
    public todoGroupsGroups: TodoUsersGroups[];
}
