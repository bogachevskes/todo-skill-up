import { IsLength } from "validator.ts/decorator/Validation";
import { ToString, ToInt } from "validator.ts/decorator/Sanitization";
import { MESSAGE_MIN_LENGTH } from '../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH } from '../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../Framework/FormRequest/Base/ValidationRequest';
import TodoGroupRepository from '../../Repository/TodoGroupRepository';

export default class TodoItemCreateRequest extends ValidationRequest
{
    todoGroupId: number | null;
    
    @ToInt()
    userId: number;

    @ToInt()
    statusId: number;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    name: string;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    description: string;

    /**
     * @see ValidationRequest
     */
     protected getCustomValidations(): Function[]
     {
        return [
            async () => {
                if (Boolean(this.todoGroupId) === false) {
                    
                    return;
                }

                const condition = await TodoGroupRepository.isGroupExists(Number(this.todoGroupId));

                return this.validateManual(condition, 'Группа доступа отсутствует', 'group_not_exists');
            },
        ];
    }
}