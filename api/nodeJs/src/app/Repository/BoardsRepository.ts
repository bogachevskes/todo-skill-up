import { SelectQueryBuilder } from 'typeorm';
import Board from '../Entity/Board';
import UserBoards from '../Entity/UserBoards';
import BoardCreateRequest from "../Http/FormRequest/Board/BoardCreateRequest";

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

    public async isGroupExists(id: number): Promise<boolean>
    {
        const result = await this.getQueryBuilder()
            .select('COUNT(b.id) as exist')
            .where('b.id = :id', { id })
            .getRawOne();

        return Boolean(result.exist);
    }

    public async findByUserId(userId: number): Promise<Board[]>
    {
        const query = this.getQueryBuilder()
            .select(['b.id', 'b.name', 'b.description', 'b.createdAt'])
            .leftJoin(UserBoards, 'ub', 'b.id = ub.todoGroupId')
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

    public async createNew(data: BoardCreateRequest): Promise<Board>
    {
        const model = this.loadModel(new Board, data);

        await model.save();

        const board: Board | undefined = await Board.findOne({select: ['id', 'name', 'description', 'createdAt', 'updatedAt'], where: {id: model.id}});

        if (board instanceof Board) {
            return board;
        }

        throw new Error('Неожидаемое поведение при записи в базу');
    }

    public async update(item: Board, attributes: object): Promise<void>
    {
        const model = this.loadModel(item, attributes);

        await model.save();
    }

    public async isUserExistsInGroup(groupId: number, userId: number): Promise<boolean>
    {
        const query = UserBoards.createQueryBuilder('ub')
            .select('COUNT(ub.id) as exist')
            .where(`ub.todo_group_id = :groupId and ub.user_id = :userId`, {groupId, userId});

        const result = await query.getRawOne();

        return Boolean(Number(result['exist']));
    }

    public async getBoardUsers(groupId: number): Promise<object[]>
    {
        const query = UserBoards.createQueryBuilder('ub')
            .select(['ubs.id, ubs.name, ubs.email'])
            .leftJoin('ub.user', 'ubs')
            .where('ub.todo_group_id = :groupId', {groupId});

        return await query.getRawMany();
    }

    public async assignUserToBoard(groupId: number, userId: number): Promise<UserBoards>
    {
        const model: UserBoards = new UserBoards;

        model.todoGroupId = groupId;
        model.userId = userId;

        return await model.save();
    }

    public async revokeUserFromBoard(groupId: number, userId: number): Promise<void>
    {
        const query = UserBoards.createQueryBuilder('ub')
            .where('todo_group_id = :groupId and user_id = :userId', { groupId, userId }
            )
            .delete();

        await query.execute();
    }
}