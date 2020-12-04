import { Column, Entity, BaseEntity, ManyToOne } from 'typeorm';
import Role from './Role';
import Permission from './Permission';

@Entity('role_permissions')
export default class RolePermission extends BaseEntity
{
    @ManyToOne(_type => Role)
    roles: Role;

    @ManyToOne(_type => Permission)
    permissions: Permission;

    @Column({ primary: true, unsigned: true, })
    rolesId: number;

    @Column({ primary: true, unsigned: true, })
    permissionsId: number;

}
