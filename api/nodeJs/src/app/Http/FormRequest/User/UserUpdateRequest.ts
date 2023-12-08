import bcrypt from 'bcryptjs';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import { MESSAGE_ALPHA_NUM, MESSAGE_MIN_LENGTH, MESSAGE_EMAIL, MESSAGE_PASSWORD_CONFIRM, MESSAGE_EMAIL_EXISTS } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import {IsEmail, IsAlphanumeric, IsLength, NotEmpty} from "validator.ts/decorator/Validation";
import { ToString, ToInt } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../../Repository/UserRepository';

export default class UserUpdateRequest extends ValidationRequest
{
    @IsAlphanumeric({ message: MESSAGE_ALPHA_NUM })
    @IsLength(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, { message: `${MESSAGE_MIN_LENGTH} поля Имя` })
    @ToString()
    public name: string;

    @IsEmail(undefined, { message: MESSAGE_EMAIL })
    @ToString()
    public email: string;

    @ToInt()
    @NotEmpty({message: 'Не задан статус'})
    public status: number;

    @IsLength(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, { message: `${MESSAGE_MIN_LENGTH} поля Пароль` })
    @ToString()
    public password: string;

    @ToString()
    public confirm_password: string;

    public getFilledAttributes(): object
    {
        const attributeKeys = [
            'name',
            'email',
            'status',
            'password',
        ];

        const attributes = {};

        for (const key of attributeKeys) {
            if (this[key] === undefined) {
                continue;
            }

            attributes[key] = this[key];
        }

        return attributes;
    }

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => {
                if (! this.password) {
                    return null;
                }

                const condition = (
                        this.password.length >= USER_PASSWORD_MIN_LENGTH
                        &&
                        this.password.length <= USER_PASSWORD_MAX_LENGTH
                    );

                return this.validateManual(condition, MESSAGE_MIN_LENGTH, 'length');
            },
            async () => {
                if (! this.password) {
                    return null;
                }
                
                this.validateCustom(
                    'equals',
                    MESSAGE_PASSWORD_CONFIRM,
                    this.password, this.confirm_password
                )

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
                    user = await (new UserRepository).findByEmail(this.email);

                return this.validateManual(user === null, MESSAGE_EMAIL_EXISTS, 'email_uniq');
            },
            async () => {

                return this.validateManual([0,1].includes(this.status), 'Не корректное значение статуса пользователя', 'user_status_is_not_correct');
            },
        ];
    }

}
