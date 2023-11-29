import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Board from './Board';
import User from './User';

@Entity('boards_users')
export default class BoardUser extends BaseEntity
{
    @ManyToOne(_type => Board)
    public board: Board;

    @ManyToOne(_type => User)
    public user: User;
    
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column({
        unsigned: true,
        comment: 'Группа доступа',
    })
    public boardId: number;

    @Column({
        unsigned: true,
        comment: 'Пользователь',
    })
    public userId: number;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP()",
    })
    public createdAt: Date;
}