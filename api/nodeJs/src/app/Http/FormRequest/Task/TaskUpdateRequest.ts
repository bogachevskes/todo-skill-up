import {IsLength, NotEmpty} from "validator.ts/decorator/Validation";
import {ToString, ToInt, ToDate} from "validator.ts/decorator/Sanitization";
import { MESSAGE_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import BoardsRepository from '../../../Repository/BoardsRepository';

export default class TaskUpdateRequest extends ValidationRequest
{
    @ToInt()
    @NotEmpty({message: 'Не задана доска задачи'})
    todoGroupId: number;

    @ToInt()
    @NotEmpty({message: 'Не задан автор задачи'})
    userId: number;

    @ToInt()
    @NotEmpty({message: 'Не задан статус задачи'})
    statusId: number;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    name: string;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: MESSAGE_MIN_LENGTH })
    @ToString()
    description: string;

    @ToDate()
    @NotEmpty({message: 'Не задана дата завершения задачи'})
    plannedCompletionAt: string;

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => {

                const condition = await (new BoardsRepository).isGroupExists(Number(this.todoGroupId));

                return this.validateManual(condition, 'Группа доступа отсутствует', 'group_not_exists');
            },
        ];
    }
}