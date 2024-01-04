import { SelectQueryBuilder } from 'typeorm';
import RuntimeError from '../../Framework/Exceptions/RuntimeError';
import User from '../Entity/User';

export default class UserRepository
{
    protected getQueryBuilder(): SelectQueryBuilder<User>
    {
        return User.createQueryBuilder('u');
    }

    public async all(condition: object = {}): Promise<User[]>
    {
        return User.find({
            select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
            ...condition,
        });
    }

    public async allExisting(): Promise<User[]>
    {
        return this.all({ where: { deletedAt: null } });
    }

    public async findById(id: number, withTrashed: boolean = false): Promise<User|null>
    {
        const condition = withTrashed ? {} : { deletedAt: null },
            user = await User.findOne({
                select: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
                where: { id, ...condition }
            });

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    public async findByEmail(email: string): Promise<User|null>
    {
        const user = await User.findOne({where: { email }});

        if (user instanceof User) {
            return user;
        }

        return null;
    }

    public async createNew(attributes: object): Promise<User>
    {
        const user = new User;

        for (const attribute in attributes) {
            user[attribute] = attributes[attribute];
        }

        await user.save();

        return user;
    }

    public async update(item: User, attributes: object): Promise<User>
    {
        await this.getQueryBuilder()
            .update(User)
            .set(attributes)
            .where('id = :id', { id: item.id })
            .execute();

        const updatedItem = await this.findById(item.id, true);

        if (updatedItem instanceof User) {
            return updatedItem;
        }

        throw new RuntimeError('Модель пользователя не найдена после обновления');
    }

    public async delete(user: User): Promise<void>
    {
        await this.update(user, { deletedAt: () => "NOW()" });
    }

    public isActive(user: User): boolean
    {
        return Boolean(user.status);
    }

    public isBlocked(user: User): boolean
    {
        return this.isActive(user) === false;
    }

    public async getUsersByCondition(condition: object, limit: number): Promise<object[]>
    {
        const query = this.getQueryBuilder()
            .select(['u.id as id', 'u.email as email'])
            .where('deleted_at IS NULL AND (u.name LIKE :name OR u.email LIKE :email)', {
                name: `%${condition['name']}%`,
                email: `%${condition['email']}%`,
            })
            .limit(limit);

        return await query.getRawMany();
    }
}
