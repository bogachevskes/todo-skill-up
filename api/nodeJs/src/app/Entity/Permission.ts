import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import Role from './Role';

@Index('idx-permissions_name', ['name'])
@Index('idx-permissions_description', ['description'])
@Index('idx-permissions_created_at', ['createdAt'])
@Index('idx-permissions_updated_at', ['updatedAt'])
@Entity('permissions')
export default class Permission extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 50,
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
        //default: () => "CURRENT_TIMESTAMP()",
        //onUpdate: "CURRENT_TIMESTAMP()"
    })
    public updatedAt: Date;

    @ManyToMany(type => Role)
    @JoinTable({
        name: 'role_permissions',
    })
    public roles: Role[];

}
