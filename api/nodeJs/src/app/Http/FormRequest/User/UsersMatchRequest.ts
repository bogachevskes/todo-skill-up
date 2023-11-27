import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import { IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";

export default class UsersMatchRequest extends ValidationRequest
{
    @IsLength(5, 100, { message: 'Введите минимум 5 символов' })
    @ToString()
    public email: string;

    @IsLength(5, 100, { message: 'Введите минимум 5 символов' })
    @ToString()
    public name: string;

    /**
     * @see ValidationRequest
     */
    public skipMissingProperties: boolean = true;
}
