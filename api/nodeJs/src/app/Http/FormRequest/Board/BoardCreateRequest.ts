import { IsLength } from "validator.ts/decorator/Validation";
import { ToString, ToInt } from "validator.ts/decorator/Sanitization";
import { MESSAGE_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';

export default class BoardCreateRequest extends ValidationRequest
{
    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    name: string;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    description: string;
}