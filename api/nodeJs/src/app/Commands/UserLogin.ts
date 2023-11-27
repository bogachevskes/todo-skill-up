import jwt from 'jsonwebtoken';
import BaseCommand from '../../Framework/Base/BaseCommand';
import UserRepository from '../Repository/UserRepository';
import User from '../Entity/User';
import ConfigService from '../../Framework/Utils/ConfigService';

export default class UserLogin extends BaseCommand
{
    /**
     * @see BaseCommand
     */
    protected async handle(): Promise<void>
    {
        const user: User = this.context.get('user');

        const token = jwt.sign(
            {
                email: user.email,
                userId: user.id,
            },
            String(ConfigService.get('TOKEN_SECRET_WORD')),
            {
                expiresIn: Number(ConfigService.get('TOKEN_EXPIRATION_TIME')),
            }
        );

        this.context.set('access', {
            token: token,
            userId: user.id,
        });
    }
}