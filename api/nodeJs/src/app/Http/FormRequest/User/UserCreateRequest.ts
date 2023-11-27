import bcrypt from 'bcryptjs';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import { MESSAGE_ALPHA_NUM, MESSAGE_MIN_LENGTH, MESSAGE_EMAIL, MESSAGE_PASSWORD_CONFIRM, MESSAGE_EMAIL_EXISTS } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import { IsEmail, IsAlphanumeric, IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../../Repository/UserRepository';
import User from '../../../Entity/User';

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

    public getAttributes(): object
    {
        return {
            name: this.name,
            email: this.email,
            password: this.password
        };
    }

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => {
                this.validateCustom(
                    'equals',
                    MESSAGE_PASSWORD_CONFIRM,
                    this.password, this.confirm_password
                );

                try {
                    this.password = await bcrypt.hash(
                        this.password,
                        12
                    );
                } catch (error) {
                    return this.validateManual(false, 'Ошибка формата пароля', 'password_format_error');
                }
            },
            async () => {
                const
                    user = await (new UserRepository).findByEmail(this.email),
                    condition = ! (user instanceof User);

                console.log(condition);

                return this.validateManual(condition, MESSAGE_EMAIL_EXISTS, 'email_uniq');
            },
        ];
    }

}
