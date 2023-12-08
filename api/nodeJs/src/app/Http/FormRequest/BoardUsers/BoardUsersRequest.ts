import * as _ from 'lodash';
import { ToInt } from "validator.ts/decorator/Sanitization";
import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import {NotEmpty} from "validator.ts/decorator/Validation";

export default class BoardUsersRequest extends ValidationRequest
{
    @ToInt()
    @NotEmpty({message: 'Не задана доска задачи'})
    public board_id: number;

    public ids: number[];

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => {

                if (_.isArray(this.ids) === true && this.ids.length > 0) {

                    return;
                }

                return this.validateManual(false, 'Не указан список пользователей', 'invalid_property');
            },
        ];
    }
}