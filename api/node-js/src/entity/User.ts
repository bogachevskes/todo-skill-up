import { Column, Entity, BaseEntity, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import Role from './Role';

@Index('idx-users_name', ['name'])
@Index('idx-users_email', ['email'], { unique: true })
@Index('idx-users_password', ['password'])
@Index('idx-users_status', ['status'])
@Index('idx-users_created_at', ['createdAt'])
@Index('idx-users_updated_at', ['updatedAt'])
@Entity('users')
export default class User extends BaseEntity
{
    @PrimaryGeneratedColumn({ unsigned: true })
    public id: number;

    @Column('varchar', {
        name: 'name',
        comment: 'Имя',
        length: 50,
    })
    public name: string;

    @Column('varchar', {
        name: 'email',
        comment: 'Почта',
        length: 50,
    })
    public email: string;

    @Column('varchar', {
        name: 'password',
        comment: 'Пароль',
        length: 100,
    })
    public password: string;

    @Column('tinyint', {
        name: 'status',
        nullable: true,
        comment: 'Статус активности',
        width: 1,
        default: () => "'1'",
      })
    public status: number;

    @Column("timestamp", {
        name: 'created_at',
        default: () => "CURRENT_TIMESTAMP(3)",
    })
    public createdAt: Date;

    @Column("timestamp", {
        name: 'updated_at',
        precision: 3,
        default: () => "CURRENT_TIMESTAMP(3)",
        onUpdate: "CURRENT_TIMESTAMP(3)"
    })
    public updatedAt: Date;

    @ManyToMany(type => Role)
    @JoinTable({
        name: 'user_roles',
    })
    roles: Role[];

    /**
     * Поиск по ид пользователя.
     * 
     * @param  { string } id
     * @return { Promise<User|null> }
     */
    static async findById(id: number): Promise<User|null>
    {
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