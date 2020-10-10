import { Repository } from 'typeorm';
import Role from '../entity/Role';

export default class RoleRepository
{
    protected repository: Repository<Role>;

    protected constructor()
    {
        this.repository = Role.getRepository();
    }

    /**
     * @return Repository<Role>
     */
    protected static getRepository(): Repository<Role>
    {
        const builder = new this;

        return builder.repository;
    }

    /**
     * Поиск по ид.
     * 
     * @param  string id
     * @return Promise<Role|null>
     */
    static async findById(id: number): Promise<Role|null>
    {
        const role = await this.getRepository().findOne({ where: { id } });

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
        const role = await
            this.getRepository()
            .findOne({where: { name }});

        if (role instanceof Role) {
            return role;
        }

        return null;
    }

    /**
     * Создание нового пользователя.
     * 
     * @param  string name
     * @return Promise<Role>
     */
    public static async createNew(name: string)
    {
        const role = new Role;

        role.name = name;

        await role.save();

        return role;
    }

}