import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import TaskStatus from './TaskStatus';
import User from './User';
import Board from './Board';

@Entity('tasks')
export default class Task extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Доска задач',
        nullable: true,
    })
    public boardId: number | null;

    @Column({
        unsigned: true,
        comment: 'Статус',
    })
    public statusId: number;

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
        name: 'planned_completion_at',
        comment: 'Планируемая дата выполнения',
        nullable: true,
    })
    public plannedCompletionAt: Date | null;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP()",
    })
    public createdAt: Date;

    @Column("timestamp", {
        name: 'updated_at',
        nullable: false,
        default: () => "CURRENT_TIMESTAMP()",
        onUpdate: "CURRENT_TIMESTAMP()"
    })
    public updatedAt: Date;

    @ManyToOne(_type => Board)
    public board: Board;

    @ManyToOne(_type => TaskStatus)
    public status: TaskStatus;
}
