import ValidationRequest from "../../../../Framework/FormRequest/Base/ValidationRequest";
import {ToInt, ToString} from "validator.ts/decorator/Sanitization";
import {IsLength, NotEmpty} from "validator.ts/decorator/Validation";
import {USER_NAME_MIN_LENGTH} from "../../../../Framework/FormRequest/Base/ValidationConstants";
import {MESSAGE_MIN_LENGTH} from "../../../../Framework/FormRequest/Base/Messages";

export default class TaskStatusRequest extends ValidationRequest {
    @ToInt()
    @NotEmpty({message: 'Не задана доска статуса'})
    boardId: number;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    name: string;
}