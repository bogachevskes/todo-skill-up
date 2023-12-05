import ValidationRequest from '../../../../Framework/FormRequest/Base/ValidationRequest';
import {IsLength} from "validator.ts/decorator/Validation";
import {ToString, Trim} from "validator.ts/decorator/Sanitization";

export default class UsersMatchRequest extends ValidationRequest
{
    @ToString()
    @Trim()
    @IsLength(5, 100, { message: 'Введите минимум 5 символов поля Email' })
    public email: string;

    @ToString()
    @Trim()
    @IsLength(5, 100, { message: 'Введите минимум 5 символов поля Имя' })
    public name: string;

    public skipMissingProperties: boolean = true;

    /**
     * @see ValidationRequest
     */
    protected getCustomValidations(): Function[]
    {
        return [
            async () => {
                if (this.email !== undefined && this.email.length !== 0) {
                    return;
                }

                if (this.name !== undefined && this.name.length !== 0) {
                    return;
                }

                return this.validateManual(false, 'Не заданы параметры поиска', 'query_params_undefined');
            },
        ];
    }
}
