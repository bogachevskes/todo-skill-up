import bcrypt from 'bcryptjs';
import BaseCommand from '../base/BaseCommand';
import UserCreateRequest from '../../request/user/UserCreateRequest';
import UserRepository from '../../repository/UserRepository';

export default class UserCreate extends BaseCommand
{
    /**
     * @var UserCreateRequest
     */
    protected request: UserCreateRequest;
    
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new UserCreateRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

    }

    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const hashedPassword = await bcrypt.hash(
            this.request.password,
            12
        );

        const user = await UserRepository.createNew(
            this.request.name,
            this.request.email,
            hashedPassword
        );

        this.context.set('user', {
            name: user.name,
            email: user.email,
        });
    }

}
