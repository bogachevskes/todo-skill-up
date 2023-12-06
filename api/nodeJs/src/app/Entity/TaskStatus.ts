import {Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from 'typeorm';
import Board from "./Board";

@Entity('task_statuses')
export default class TaskStatus extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Доска задач',
    })
    public boardId: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 10,
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

    @ManyToOne(_type => Board)
    public board: Board;

}
