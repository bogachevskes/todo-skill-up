import { IsLength } from "validator.ts/decorator/Validation";
import { ToString } from "validator.ts/decorator/Sanitization";
import { MESSAGE_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';

export default class BoardRequest extends ValidationRequest
{
    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: `${MESSAGE_MIN_LENGTH} поля Имя` })
    @ToString()
    name: string;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: `${MESSAGE_MIN_LENGTH} поля Описание` })
    @ToString()
    description: string;
}