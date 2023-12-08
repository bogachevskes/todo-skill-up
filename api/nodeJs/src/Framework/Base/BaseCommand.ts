import CommandContext from './CommandContext';
import CommandInterface from './CommandInterface';
import ValidationError from '../Exceptions/ValidationError';

export default abstract class BaseCommand implements CommandInterface
{
    protected context: CommandContext;

    protected abstract handle(): Promise<void>

    protected validateData(): void
    {
        //
    }

    protected throwValidationError(message: string): never
    {
        throw new ValidationError(message);
    }

    protected getImportantKeys(): string[]
    {
        return [

        ];
    }

    protected checkImportantKeys(): void
    {
        const importantKeys = this.getImportantKeys();

        importantKeys.forEach((element) => {
            const value = this.context.get(element);

            if (! Boolean(value)) {
                this.throwValidationError(`Значение ${element} обязательно`);
            }
        });
    }

    protected async validate(): Promise<void>
    {
        this.checkImportantKeys();
        await this.validateData();
    }

    public async execute(context: CommandContext): Promise<void>
    {
        this.context = context;

        await this.validate();
        
        await this.handle();
    }

}
