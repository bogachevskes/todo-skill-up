import { Column, Entity, BaseEntity, ManyToOne } from 'typeorm';
import User from './User';
import Role from './Role';

@Entity('user_roles')
export default class UserRole extends BaseEntity
{
    @ManyToOne(_type => User)
    users: User;

    @ManyToOne(_type => Role)
    roles: Role;

    @Column({ primary: true, unsigned: true, })
    usersId: number;

    @Column({ primary: true, unsigned: true, })
    rolesId: number;
}
