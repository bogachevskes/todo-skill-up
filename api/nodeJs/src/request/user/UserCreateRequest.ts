import ValidationRequest from '../base/ValidationRequest';
import { MESSAGE_ALPHA_NUM, MESSAGE_MIN_LENGTH, MESSAGE_EMAIL, MESSAGE_PASSWORD_CONFIRM, MESSAGE_EMAIL_EXISTS } from '../base/Messages';
import { USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../base/ValidationConstants';
import { IsEmail, IsAlphanumeric, IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../repository/UserRepository';
import User from '../../entity/User';

export default class UserCreateRequest extends ValidationRequest
{
    @IsAlphanumeric({ message: MESSAGE_ALPHA_NUM })
    @IsLength(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    public name: string;

    @IsEmail(undefined, { message: MESSAGE_EMAIL })
    @ToString()
    public email: string;

    @IsLength(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, { message: MESSAGE_MIN_LENGTH })
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
