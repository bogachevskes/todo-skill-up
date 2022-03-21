import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Role from './Role';
import Permission from './Permission';

@Entity('role_permissions')
export default class RolePermission extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({ unsigned: true })
    public roleId: number;

    @Column({ unsigned: true })
    public permissionId: number;

    @ManyToOne(_type => Role)
    public role: Role;

    @ManyToOne(_type => Permission)
    public permission: Permission;
}
