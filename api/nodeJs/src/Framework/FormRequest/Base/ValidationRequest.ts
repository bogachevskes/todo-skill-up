import { Validator } from "validator.ts/Validator";
import ValidationErrorBag from './ValidationErrorBag';
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import Configurable from '../../Base/Configurable';

export default abstract class ValidationRequest extends Configurable
{
    /**
     * @var Validator
     */
    protected validator: Validator;

    /**
     * @var ValidationErrorInterface[]
     */
    protected defaultValidationResult: ValidationErrorInterface[] = [];

    /**
     * @var ValidationErrorInterface[]
     */
    protected customValidationResult: ValidationErrorInterface[] = [];

    /**
     * @var ValidationErrorInterface[]
     */
    protected validationResult: ValidationErrorInterface[] = [];

    /**
     * @var string[]
     */
    protected errorMessages: string[] = [];

    public constructor(parameters)
    {
        super(parameters);

        this.validator = new Validator;
    }

    /**
     * Получение результатов валидации.
     * 
     * @return void
     */
    protected getDefaultValidationResults(): void
    {
        this.defaultValidationResult = this.validator.validate(this);
    }

    /**
     * Возвращает ручную валидацию.
     * 
     * @return Function[]
     */
    protected getCustomValidations(): Function[]
    {
        return [

        ];
    }

    /**
     * Выполнение ручной валидации.
     * 
     * @return Promise<void>
     */
    protected async getCustomValidationResults(): Promise<void>
    {
        const customValidations: Function[] = this.getCustomValidations();

        for (const callback of customValidations) {
            const result = await callback();

            if (result instanceof ValidationErrorBag) {
                this.customValidationResult.push(result);
            }
        }
    }

    /**
     * Определение результатов валидации.
     * 
     * @return void
     */
    protected defineValidationResult(): void
    {
        this.validationResult = this.defaultValidationResult.concat(this.customValidationResult);
    }

    /**
     * Определение сообщений об ошибках.
     * 
     * @return void
     */
    protected defineErrorMessages(): void
    {
        for (const error of this.validationResult) {
            this.errorMessages.push(error.errorMessage);
        }
    }

    /**
     * Дополнительная валидация свойства.
     * 
     * @param  string method
     * @param  string errorMessage
     * @param  any ...args
     * @return ValidationErrorInterface|null
     */
    protected validateCustom(method: string, errorMessage: string, ...args): ValidationErrorInterface|null
    {
        if (this.validator[method](...args)) {
            return null
        }
        
        return new ValidationErrorBag(errorMessage, method);
    }

    /**
     * Ручная валидация свойства.
     * 
     * @param  boolean condition
     * @param  string errorMessage
     * @param  string method
     * @return ValidationErrorInterface|null
     */
    protected validateManual(condition: boolean, errorMessage: string, method: string): ValidationErrorInterface|null
    {
        return condition ? null : new ValidationErrorBag(errorMessage, method);
    }
    
    /**
     * Валидация.
     * 
     * @return Promise<void>
     */
    public async validate(): Promise<void>
    {
        this.getDefaultValidationResults();
        await this.getCustomValidationResults();
        this.defineValidationResult();
        this.defineErrorMessages();
    }

    /**
     * Результат валиден?
     * 
     * @return boolean
     */
    public isValid(): boolean
    {
        return Boolean(this.errorMessages.length) === false;
    }

    /**
     * @return boolean
     */
    public isNotValid(): boolean
    {
        return ! this.isValid();
    }

    /**
     * Возвращает
     * первое сообщение ошибки.
     * 
     * @return string
     */
    public getFirstError(): string
    {
        if (this.isValid()) {
            return '';
        }

        return this.errorMessages[0];
    }

}
