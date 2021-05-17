import bcrypt from 'bcryptjs';
import BaseCommand from '../base/BaseCommand';
import UserUpdateRequest from '../../../request/user/UserUpdateRequest';
import UserRepository from '../../repository/UserRepository';
import User from '../../entity/User';

export default class UserCreate extends BaseCommand
{
    /**
     * @var UserUpdateRequest
     */
    protected request: UserUpdateRequest;

    /**
     * @var User
     */
    protected user: User;

    /**
     * @var object
     */
    protected attributes: object;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new UserUpdateRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

        const user = await UserRepository.findById(
                this.request.id
            );

        if (! (user instanceof User)) {
            this.throwValidationError('Пользователь не найден');
        }

        this.user = user;
    }

    /**
     * Подготовка аттрибутов к обновлению.
     * 
     * @return Promise<void>
     */
    protected async prepareAttributes(): Promise<void>
    {
        const attributes = {
            name: this.request.name,
            email: this.request.email,
        };

        if (this.request.password) {
            attributes['password'] = await bcrypt.hash(
                    this.context.get('password'),
                    12
                );
        }

        this.attributes = attributes;
    }

    /**
     * Обновление сущности пользователя.
     * 
     * @return Promise<void>
     */
    protected async updateUser(): Promise<void>
    {
        this.user = await UserRepository.update(this.user, this.attributes);
    }

    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        await this.prepareAttributes();

        await this.updateUser();

        this.context.set('user', {
            name: this.user.name,
            email: this.user.email,
        });
    }

}
