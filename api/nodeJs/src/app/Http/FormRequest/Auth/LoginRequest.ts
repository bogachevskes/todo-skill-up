import { MESSAGE_MIN_LENGTH, MESSAGE_EMAIL } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import { IsLength, NotEmpty } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../../Repository/UserRepository';
import User from '../../../Entity/User';
import PasswordHasher from "../../../Components/Security/PasswordHasher";
import DIContainer from "../../../../Framework/Container/DIContainer";

export default class LoginRequest extends ValidationRequest
{
    @ToString()
    @NotEmpty({message: 'Не задана почта'})
    public email: string;

    @IsLength(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, { message: `${MESSAGE_MIN_LENGTH} поля Имя` })
    @ToString()
    @NotEmpty({message: 'Не задан пароль'})
    public password: string;

    private hasher: PasswordHasher;

    public constructor(parameters)
    {
        super(parameters);
        this.hasher = DIContainer.get<PasswordHasher>(PasswordHasher);
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
             async () => {
                 const user: User|null = await (new UserRepository).findByEmail(this.email);

                 const condition: boolean = (user instanceof User) && await this.hasher.verify(this.password, String(user['password']))

                 return this.validateManual(condition, 'Неверный логин или пароль', 'login_incorrect');
             },
         ];
     }
}