import { Repository } from 'typeorm';
import User from '../entity/User';

export default class UserRepository
{
    protected repository: Repository<User>;

    protected constructor()
    {
        this.repository = User.getRepository();
    }

    /**
     * @return { Repository<User> }
     */
    protected static getRepository(): Repository<User>
    {
        const builder = new this;

        return builder.repository;
    }

    /**
     * Поиск по ид пользователя.
     * 
     * @param  { string } id
     * @return { Promise<User|null> }
     */
    static async findById(id: number): Promise<User|null>
    {
        const query = this.getRepository();
        
        const user = await this.getRepository().findOne({ where: { id } });

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    /**
     * Поиск по почте пользователя.
     * 
     * @param  { string } email 
     * @return { Promise<User|null> }
     */
    public static async findByEmail(email: string): Promise<User|null>
    {
        const user = await
            this.getRepository()
            .findOne({where: {email: email}});

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    /**
     * Создание нового пользователя.
     * 
     * @param  { string } name 
     * @param  { string } email 
     * @param  { string } password 
     * @return { Promise<User> }
     */
    public static async createNew(name: string, email: string, password: string)
    {
        const user = new User;

        user.name = name;
        user.email = email;
        user.password = password;

        await user.save();

        return user;
    }

}