import Db from './Db';

export default class AuthManager
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
}