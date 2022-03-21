import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Index('idx-todo_item_name', ['name'])
@Index('idx-todo_item_created_at', ['createdAt'])
@Index('idx-todo_item_updated_at', ['deletedAt'])
@Entity('todo_access_group')
export default class TodoAccessGroup extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 100,
    })
    public name: string;

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
    public deletedAt: Date;
}