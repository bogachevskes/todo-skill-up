import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './User';
import Role from './Role';

@Entity('user_roles')
export default class UserRole extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({ unsigned: true })
    userId: number;

    @Column({ unsigned: true })
    public roleId: number;

    @ManyToOne(() => User, user => user.userRoles)
    user: User;

    @ManyToOne(() => Role, role => role.userRoles)
    role: Role;
}
