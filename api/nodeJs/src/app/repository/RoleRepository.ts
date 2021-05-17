import Role from '../entity/Role';

export default class RoleRepository
{
    /**
     * Поиск по ид.
     * 
     * @param  number id
     * @return Promise<Role|null>
     */
    public static async findById(id: number): Promise<Role|null>
    {
        const role = await Role.findOne({ where: { id } });

        if (role instanceof Role) {
            return role;
        }

        return null;
    }

    /**
     * Поиск по имени.
     * 
     * @param  string name
     * @return Promise<Role|null>
     */
    public static async findByName(name: string): Promise<Role|null>
    {
        const role = await Role.findOne({where: { name }});

        if (role instanceof Role) {
            return role;
        }

        return null;
    }

    /**
     * Создание новой роли.
     * 
     * @param  string name
     * @param  string description
     * @return Promise<Role>
     */
    public static async createNew(name: string, description: string): Promise<Role>
    {
        const role = new Role;

        role.name = name;
        role.description = description;

        await role.save();

        return role;
    }

    public static async createPermission(role: Role)
    {
        
    }

}