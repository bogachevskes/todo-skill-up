import { Validator } from "validator.ts/Validator";
import ValidationErrorBag from './ValidationErrorBag';
import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";
import Configurable from '../../Base/Configurable';

export default abstract class ValidationRequest extends Configurable
{
    public skipMissingProperties: boolean;

    protected validator: Validator;

    protected defaultValidationResult: ValidationErrorInterface[] = [];

    protected customValidationResult: ValidationErrorInterface[] = [];

    protected validationResult: ValidationErrorInterface[] = [];

    protected errorMessages: string[] = [];

    public constructor(parameters)
    {
        super(parameters);

        this.validator = new Validator;
    }

    protected getDefaultValidationResults(): void
    {
        this.defaultValidationResult = this.validator.validate(this, { skipMissingProperties: this.skipMissingProperties });
    }

    protected getCustomValidations(): Function[]
    {
        return [

        ];
    }

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

    protected defineValidationResult(): void
    {
        this.validationResult = this.defaultValidationResult.concat(this.customValidationResult);
    }

    protected defineErrorMessages(): void
    {
        for (const error of this.validationResult) {
            this.errorMessages.push(error.errorMessage);
        }
    }

    protected validateCustom(method: string, errorMessage: string, ...args): ValidationErrorInterface|null
    {
        if (this.validator[method](...args)) {
            return null
        }
        
        return new ValidationErrorBag(errorMessage, method);
    }

    protected validateManual(condition: boolean, errorMessage: string, method: string): ValidationErrorInterface|null
    {
        return condition ? null : new ValidationErrorBag(errorMessage, method);
    }

    public async validate(): Promise<void>
    {
        this.getDefaultValidationResults();
        await this.getCustomValidationResults();
        this.defineValidationResult();
        this.defineErrorMessages();
    }

    public isValid(): boolean
    {
        return Boolean(this.errorMessages.length) === false;
    }

    public isNotValid(): boolean
    {
        return ! this.isValid();
    }

    public getFirstError(): string
    {
        if (this.isValid()) {
            return '';
        }

        return this.errorMessages[0];
    }

}
