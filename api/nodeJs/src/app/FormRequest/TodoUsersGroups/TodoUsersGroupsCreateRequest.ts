import * as _ from 'lodash';
import { ToInt } from "validator.ts/decorator/Sanitization";
import ValidationRequest from '../../../Framework/FormRequest/Base/ValidationRequest';

export default class TodoUsersGroupsCreateRequest extends ValidationRequest
{
    @ToInt()
    public todo_group_id: number;
    
    public user_emails: string[];

    /**
     * @see ValidationRequest
     */
     protected getCustomValidations(): Function[]
     {
        return [
            async () => {
                
                const condition = _.isArray(this.user_emails);
                
                if (condition === true) {
                    
                    return;
                }

                return this.validateManual(condition, 'Не указан список пользователей', 'invalid_property');
            },
        ];
     }
}