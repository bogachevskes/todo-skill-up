import { ValidationErrorInterface } from "validator.ts/ValidationErrorInterface";

export default class ValidationErrorBag implements ValidationErrorInterface
{
    public errorMessage: string;

    public errorName: string;

    public property: string;

    public errorCode: number;

    public value: any;

    public required: any;

    public objectClass: Function;

    public constructor(
        errorMessage: string,
        errorName: string,
        property: string = '',
        errorCode: number = 30,
        value: any = null,
        required: any = null,
        objectClass: any = null,
    ) {
        this.errorMessage   = errorMessage;
        this.errorName      = errorName;
        this.property       = property;
        this.errorCode      = errorCode;
        this.value          = value;
        this.required       = required;
        this.objectClass    = (objectClass instanceof Function) ? objectClass : () => {};
    }

}
