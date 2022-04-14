import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany, BaseEntity } from 'typeorm';
import UserRole from './UserRole';
import RolePermission from './RolePermission';
import Permission from './Permission';
import User from './User';

@Index('idx-roles_name', ['name'])
@Index('idx-roles_description', ['description'])
@Index('idx-roles_created_at', ['createdAt'])
@Index('idx-roles_updated_at', ['updatedAt'])
@Entity('roles')
export default class Roles extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 10,
    })
    name: string;

    @Column('varchar', {
        name: 'description',
        comment: 'Описание',
        length: 50,
    })
    description: string;

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

    @OneToMany(() => UserRole, userRole => userRole.role)
    public userRoles: UserRole[];

    @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
    public rolePermission: RolePermission[];

}
