import { IsLength, NotEmpty } from "validator.ts/decorator/Validation";
import {ToString, ToInt, ToDate} from "validator.ts/decorator/Sanitization";
import { MESSAGE_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/Messages';
import { USER_NAME_MIN_LENGTH } from '../../../../Framework/FormRequest/Base/ValidationConstants';
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import BoardsRepository from '../../../Repository/BoardsRepository';

export default class TaskRequest extends ValidationRequest
{
    @ToInt()
    @NotEmpty({message: 'Не задана доска задачи'})
    boardId: number;

    @ToInt()
    @NotEmpty({message: 'Не задан статус задачи'})
    statusId: number;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: `${MESSAGE_MIN_LENGTH} поля Имя`})
    @ToString()
    name: string;

    @IsLength(USER_NAME_MIN_LENGTH, 300, { message: `${MESSAGE_MIN_LENGTH} поля Описание`})
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
                const condition = await (new BoardsRepository).isBoardExists(Number(this.boardId));

                return this.validateManual(condition, 'Доска не найдена', 'board_not_exists');
            },
        ];
    }
}