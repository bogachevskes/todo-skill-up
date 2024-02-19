import { SelectQueryBuilder } from 'typeorm';
import Db from '../Components/Db';
import Board from '../Entity/Board';
import BoardUser from '../Entity/BoardUser';
import BoardRequest from '../Http/FormRequest/Board/BoardRequest';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;

export default class BoardsRepository
{
    protected getQueryBuilder(): SelectQueryBuilder<Board>
    {
        return Board.createQueryBuilder('b');
    }

    protected loadModel(model: Board, data: object): Board
    {
         for (const key in data) {
             model[key] = data[key];
         }

         return model;
    }

    public async isBoardExists(id: number): Promise<boolean>
    {
        const result = await this.getQueryBuilder()
            .select('COUNT(b.id) as exist')
            .where('b.id = :id', { id })
            .getRawOne();

        return Boolean(Number(result['exist']));
    }

    public async findByUserId(userId: number): Promise<Board[]>
    {
        const query = this.getQueryBuilder()
            .select(['b.id', 'b.name', 'b.description', 'b.createdAt', 'b.updatedAt'])
            .leftJoin(BoardUser, 'ub', 'b.id = ub.boardId')
            .where('ub.userId = :userId', { userId });

        return query.getMany();
    }

    public async deleteById(id: number, trx: Transaction|null = null): Promise<void>
    {
        const runner  = trx === null ? Db : trx;

        await runner.table('boards')
            .where({
                'id': id,
            })
            .del();
    }

    public createNew(data: BoardRequest): Board
    {
        return this.loadModel(new Board, data);
    }

    public async update(item: Board, attributes: object): Promise<void>
    {
        const model = this.loadModel(item, attributes);

        await model.save();
    }

    public async isUserExistsInBoard(boardId: number, userId: number): Promise<boolean>
    {
        const query = BoardUser.createQueryBuilder('ub')
            .select('COUNT(ub.id) as exist')
            .where(`ub.board_id = :boardId and ub.user_id = :userId`, {boardId, userId});

        const result = await query.getRawOne();

        return Boolean(Number(result['exist']));
    }

    public async getBoardUsers(boardId: number): Promise<object[]>
    {
        const query = BoardUser.createQueryBuilder('ub')
            .select(['ubs.id, ubs.name, ubs.email'])
            .leftJoin('ub.user', 'ubs')
            .where('ub.board_id = :boardId AND ubs.deleted_at IS NULL', {boardId});

        return await query.getRawMany();
    }

    public createUserToBoardAssignment(boardId: number, userId: number, roleId: number|null = null): BoardUser
    {
        const model: BoardUser = new BoardUser;

        model.boardId = boardId;
        model.userId = userId;

        if (roleId !== null) {
            model.roleId = roleId;
        }

        return model;
    }

    public async revokeUserFromBoard(boardId: number, userId: number, trx: Transaction|null = null): Promise<void>
    {
        const runner  = trx === null ? Db : trx;

        await runner.table('boards_users')
            .where({
                'board_id': boardId,
                'user_id': userId,
            })
            .del();
    }

    public async userIsBoardOwner(boardId: number, userId: number): Promise<boolean>
    {
        const result = await Db.count('ub.user_id as cnt')
            .from({ub: 'boards_users'})
            .leftJoin({ubr: 'boards_users_roles'}, 'ub.role_id', 'ubr.id')
            .where({
                'ub.board_id': boardId,
                'ub.user_id': userId,
                'ubr.name': 'owner',
            });

        return Boolean(Number(result[0]['cnt']));
    }

    public async getBoardOwner(boardId: number): Promise<object>
    {
        const res = await Db.select('u.id as id', 'u.name as name', 'u.email as email')
            .from({ub: 'boards_users'})
            .leftJoin({ubr: 'boards_users_roles'}, 'ub.role_id', 'ubr.id')
            .leftJoin({u: 'users'}, 'ub.user_id', 'u.id')
            .where({
                'ub.board_id': boardId,
                'ubr.name': 'owner',
            })
            .first();

        return res;
    }
}