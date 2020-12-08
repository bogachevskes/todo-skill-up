import Permission from '../entity/Permission';

export default class PermissionsRepository
{
    /**
     * Поиск по имени.
     * 
     * @param  string name
     * @return Promise<Permission|null>
     */
    public static async findByName(name: string): Promise<Permission|null>
    {
        const model = await Permission.findOne({where: { name }});

        if (model instanceof Permission) {
            return model;
        }

        return null;
    }
    
    /**
     * Создание нового разрешения.
     * 
     * @param  string name
     * @return Promise<Permission>
     */
    public static async createNew(name: string): Promise<Permission>
    {
        const model = new Permission;

        model.name = name;

        await model.save();

        return model;
    }

}
