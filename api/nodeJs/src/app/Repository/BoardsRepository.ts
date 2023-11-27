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

    public createNew(data: BoardCreateRequest): Board
    {
        return this.loadModel(new Board, data);
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

    public createUserToBoardAssignment(groupId: number, userId: number): UserBoards
    {
        const model: UserBoards = new UserBoards;

        model.todoGroupId = groupId;
        model.userId = userId;

        return model;
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