import ValidationRequest from './base/ValidationRequest';
import { MESSAGE_ALPHA_NUM, MESSAGE_MIN_LENGTH, MESSAGE_EMAIL, MESSAGE_PASSWORD_CONFIRM, MESSAGE_EMAIL_EXISTS } from './base/Messages';
import { IsEmail, IsAlphanumeric, IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import UserRepository from '../repository/UserRepository';
import User from '../entity/User';

export default class UserCreateRequest extends ValidationRequest
{
    @IsAlphanumeric({ message: MESSAGE_ALPHA_NUM })
    @IsLength(5, 255, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    public name: string;

    @IsEmail(undefined, { message: MESSAGE_EMAIL })
    @ToString()
    public email: string;

    @IsLength(5, 255, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    public password: string;

    @ToString()
    public confirm_password: string;

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => this.validateCustom(
                'equals',
                MESSAGE_PASSWORD_CONFIRM,
                this.password, this.confirm_password
            ),
            async () => {
                const
                    user = await UserRepository.findByEmail(this.email),
                    condition = ! (user instanceof User);

                return this.validateManual(condition, MESSAGE_EMAIL_EXISTS, 'email_uniq');
            },
        ];
    }

}
