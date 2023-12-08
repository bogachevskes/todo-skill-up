import { SelectQueryBuilder } from 'typeorm';
import Board from '../Entity/Board';
import BoardUser from '../Entity/BoardUser';
import BoardRequest from "../Http/FormRequest/Board/BoardRequest";

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

    public async deleteById(id: number): Promise<void>
    {
        const query = this.getQueryBuilder()
            .where('id = :id', { id })
            .delete();

        await query.execute();
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

    public createUserToBoardAssignment(boardId: number, userId: number): BoardUser
    {
        const model: BoardUser = new BoardUser;

        model.boardId = boardId;
        model.userId = userId;

        return model;
    }

    public async revokeUserFromBoard(boardId: number, userId: number): Promise<void>
    {
        const query = BoardUser.createQueryBuilder('ub')
            .where('board_id = :boardId and user_id = :userId', { boardId, userId })
            .delete();

        await query.execute();
    }
}