import ValidationRequest from '../../../Framework/FormRequest/Base/ValidationRequest';
import { IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";

export default class MatchUsersByEmailRequest extends ValidationRequest
{
    @IsLength(5, 100, { message: 'Введите минимум 5 символов' })
    @ToString()
    public email: string;
}
