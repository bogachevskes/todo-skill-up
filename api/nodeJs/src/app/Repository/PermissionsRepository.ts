import Permission from '../Entity/Permission';

export default class PermissionsRepository
{
    /**
     * Разрешение на управление
     * пользователями.
     * @var string
     */
    public static PERMISSION_CAN_MANAGE_USERS: string = 'canManageUsers';

    /**
     * Разрешение на управление
     * списком зада пользователей.
     * @var string
     */
    public static PERMISSION_CAN_MANAGE_USERS_TODO: string = 'canManageUsersTodo';
    
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
     * @param  string description
     * @return Promise<Permission>
     */
    public static async createNew(name: string, description: string): Promise<Permission>
    {
        const model = new Permission;

        model.name = name;
        model.description = description;

        await model.save();

        return model;
    }

}
