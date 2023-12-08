import Db from '../Components/Db';

export default class PermissionsRepository
{
    public async getUserPermissions(userId: Number): Promise<string[]>
    {
        const res = await Db.select('aic.child')
            .from({aa: 'auth_assignment'})
            .leftJoin({aic: 'auth_item_child'}, 'aa.item_name', 'aic.parent')
            .where({
                'aa.user_id': userId,
            });

        return res.map(row => row.child);
    }

    public async userHasPermission(permissionName: string, userId: number): Promise<boolean>
    {
        const result = await Db.count('aic.child as cnt')
            .from({aa: 'auth_assignment'})
            .leftJoin({aic: 'auth_item_child'}, 'aa.item_name', 'aic.parent')
            .where({
                'aa.user_id': userId,
                'aic.child': permissionName,
            });

        return Boolean(Number(result[0]['cnt']));
    }
}