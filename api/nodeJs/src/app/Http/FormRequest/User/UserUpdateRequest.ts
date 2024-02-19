import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import { MESSAGE_MIN_LENGTH, MESSAGE_EMAIL, MESSAGE_EMAIL_EXISTS } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import { IsLength, NotEmpty } from "validator.ts/decorator/Validation";
import { ToString, ToInt } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../../Repository/UserRepository';
import PasswordHasher from "../../../Components/Security/PasswordHasher";
import User from "../../../Entity/User";

export default class UserUpdateRequest extends ValidationRequest
{
    @IsLength(USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH, { message: `${MESSAGE_MIN_LENGTH} поля Имя` })
    @ToString()
    @NotEmpty({message: 'Не задано имя'})
    public name: string;

    @ToString()
    @NotEmpty({message: 'Не задана почта'})
    public email;

    @ToInt()
    @NotEmpty({message: 'Не задан статус'})
    public status: number;

    @IsLength(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, { message: `${MESSAGE_MIN_LENGTH} поля Пароль` })
    @ToString()
    @NotEmpty({message: 'Не задан пароль'})
    public password: string;

    private hasher: PasswordHasher;

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
            async() => {
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

                return this.validateManual(emailRegex.test(this.email), MESSAGE_EMAIL, 'email_not_valid');
            },
            async() => {

                if (this.name === undefined) {
                    return;
                }

                const exp: RegExp = /^(?:[a-zA-Zа-яА-Я0-9_]+ ?)+[a-zA-Zа-яА-Я0-9_]+$/;

                return this.validateManual(Boolean(this.name.match(exp)) === true, 'Имя введено некорректно. Попробуйте другое имя', 'email_uniq');
            },
            async() => {
                try {
                    this.password = await this.hasher.hash(this.password);
                } catch (error) {
                    return this.validateManual(false, 'Ошибка формата пароля', 'password_format_error');
                }
            },
            async() => {

                if (this.email === undefined) {
                    return;
                }

                this.email = this.email.toLowerCase();

                const user: User|null = await (new UserRepository).findByEmail(this.email);

                return this.validateManual(user === null, MESSAGE_EMAIL_EXISTS, 'email_uniq');
            },
            async () => {

                return this.validateManual([0,1].includes(this.status), 'Не корректное значение статуса пользователя', 'user_status_is_not_correct');
            },
        ];
    }

}
