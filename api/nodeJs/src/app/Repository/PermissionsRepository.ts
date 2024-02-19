import Db from '../Components/Db';
import { Knex } from 'knex';
import Transaction = Knex.Transaction;

export default class PermissionsRepository
{
    public async getUserPermissions(userId: Number): Promise<string[]>
    {
        const res = await Db.select('aic.child')
            .from({aa: 'auth_assignment'})
            .leftJoin({aic: 'auth_item_child'}, 'aa.item_name', 'aic.parent')
            .leftJoin({ai: 'auth_item'}, 'ai.name', 'aa.item_name')
            .where({
                'aa.user_id': userId,
            })
            .whereIn('ai.type', [1, 2]);

        return res.map(row => row.child);
    }

    public async getBoardsPermissions(): Promise<string[]>
    {
        const res = await Db.select('ai.name')
            .from({ai: 'auth_item'})
            .where({
                'ai.type': 3,
            });

        return res.map(row => row.name);
    }

    public async getBoardUserPermissions(boardId: number, userId: number): Promise<string[]>
    {
        const res = await Db.select('ai.name')
            .from({aa: 'auth_assignment'})
            .leftJoin({ai: 'auth_item'}, 'aa.item_name', 'ai.name')
            .where({
                'aa.user_id': userId,
                'aa.object_id': boardId,
                'ai.type': 3,
            });

        return res.map(row => row.name);
    }

    public async userHasPermission(permissionName: string, userId: number): Promise<boolean>
    {
        const condition = {
            'aa.user_id': userId,
            'aic.child': permissionName,
        };

        const result = await Db.count('aic.child as cnt')
            .from({aa: 'auth_assignment'})
            .leftJoin({aic: 'auth_item_child'}, 'aa.item_name', 'aic.parent')
            .where(condition);

        return Boolean(Number(result[0]['cnt']));
    }

    public async userHasBoardPermission(permissionName: string, userId: number, boardId: number): Promise<boolean>
    {
        const condition = {
            'aa.item_name': permissionName,
            'aa.user_id': userId,
            'aa.object_id': boardId,
        };

        const result = await Db.count('aa.item_name as cnt')
            .from({aa: 'auth_assignment'})
            .where(condition);

        return Boolean(Number(result[0]['cnt']));
    }

    public async isBoardPermissionExists(permissionId: string): Promise<boolean>
    {
        const result = await Db.count('ai.name as cnt')
            .from({ai: 'auth_item'})
            .where({
                'ai.name': permissionId,
                'ai.type': 3,
            });

        return Boolean(Number(result[0]['cnt']));
    }

    public async assignBoardUserPermission(boardId: number, userId: number, permissionId: string): Promise<void>
    {
        await Db.table('auth_assignment')
            .insert({
                'item_name': permissionId,
                'user_id': userId,
                'object_id': boardId,
            });
    }

    public async revokeBoardUserPermission(boardId: number, userId: number, permissionId: string)
    {
        await Db.table('auth_assignment')
            .where({
                'item_name': permissionId,
                'user_id': userId,
                'object_id': boardId,
            })
            .del();
    }

    public async revokeAllBoardUserPermission(boardId: number, userId: number, trx: Transaction|null = null)
    {
        const runner  = trx === null ? Db : trx;

        await runner.table('auth_assignment')
            .where({
                'user_id': userId,
                'object_id': boardId,
            })
            .del();
    }
}