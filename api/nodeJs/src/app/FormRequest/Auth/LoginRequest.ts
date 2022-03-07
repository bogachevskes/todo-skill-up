import bcrypt from 'bcryptjs';
import { MESSAGE_MIN_LENGTH, MESSAGE_EMAIL } from '../../../Framework/FormRequest/Base/Messages';
import { USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH } from '../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../Framework/FormRequest/Base/ValidationRequest';
import { IsEmail, IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import UserRepository from '../../Repository/UserRepository';
import User from '../../Entity/User';

export default class LoginRequest extends ValidationRequest
{
    @IsEmail(undefined, { message: MESSAGE_EMAIL })
    @ToString()
    public email: string;

    @IsLength(USER_PASSWORD_MIN_LENGTH, USER_PASSWORD_MAX_LENGTH, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    public password: string;

    /**
     * @see ValidationRequest
     */
     protected getCustomValidations(): Function[]
     {
         return [
            async () => {
                const user = await UserRepository.findByEmail(this.email);

                const condition = (user instanceof User) && await bcrypt.compare(this.password, user!.password);

                return this.validateManual(condition, 'Неверный логин или пароль', 'login_incorrect');
            },
         ];
     }
}