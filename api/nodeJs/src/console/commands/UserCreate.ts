import bcrypt from 'bcryptjs';
import BaseCommand from '../base/BaseCommand';
import UserCreateRequest from '../../request/UserCreateRequest';
import UserRepository from '../../repository/UserRepository';

export default class UserCreate extends BaseCommand
{
    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        const request = new UserCreateRequest(this.context.all());
        
        await request.validate();

        if (request.isValid()) {
            return;
        }

        this.throwValidationError(request.getFirstError());
    }

    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const hashedPassword = await bcrypt.hash(
            this.context.get('password'),
            12
        );

        const user = await UserRepository.createNew(
            this.context.get('name'),
            this.context.get('email'),
            hashedPassword
        );

        this.context.set('user', {
            name: user.name,
            email: user.email,
        });
    }

}
