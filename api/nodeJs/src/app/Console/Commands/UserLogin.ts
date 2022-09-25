import BaseCommand from '../../../Framework/Base/BaseCommand';
import UserLoginRequest from '../../FormRequest/User/UserLoginRequest';
import UserRepository from '../../Repository/UserRepository';
import User from '../../Entity/User';

import ConfigService from '../../../Framework/Utils/ConfigService';
import jwt from 'jsonwebtoken';

export default class UserLogin extends BaseCommand
{
    /**
     * @var LoginRequest
     */
    protected request: UserLoginRequest;

    /**
     * @var User | null
     */
    protected user: User | null;

    /**
     * @see BaseCommand
     */
     protected getImportantKeys(): string[]
     {
         return [
            'email',
            'password',
         ];
     }

    /**
     * @see BaseCommand
     */
    protected async validateData(): Promise<void>
    {
        this.request = new UserLoginRequest(this.context.all());
        
        await this.request.validate();

        if (this.request.isNotValid()) {
            this.throwValidationError(this.request.getFirstError());
        }

        const user = await UserRepository.findByEmail(this.request.email);

        if ((user instanceof User) && UserRepository.isBlocked(user)) {
            this.throwValidationError('Пользователь заблокирован');
        }

        this.user = user;
    }

    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const token = jwt.sign(
            {
                email: this.user!.email,
                userId: this.user!.id,
            },
            String(ConfigService.get('TOKEN_SECRET_WORD')),
            {
                expiresIn: Number(ConfigService.get('TOKEN_EXPIRATION_TIME')),
            }
        );

        this.context.set('access', {
            token: token,
            userId: this.user!.id,
        });
    }
}