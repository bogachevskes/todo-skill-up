import CommandContext from './CommandContext';
import CommandInterface from './CommandInterface';
import ValidationError from '../Exceptions/ValidationError';

export default abstract class BaseCommand implements CommandInterface
{
    protected context: CommandContext;

    protected abstract handle(): Promise<void>

    protected abstract validateData(): void;

    /**
     * @param message
     * @return never
     */
    protected throwValidationError(message: string): never
    {
        throw new ValidationError(message);
    }

    /**
     * Возвращает необходимые
     * свойства контекста.
     * 
     * @return string[]
     */
    protected getImportantKeys(): string[]
    {
        return [

        ];
    }

    /**
     * Проверка существования
     * необходимых свойств в контексте.
     * 
     * @return void
     */
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

    /**
     * Валидация контекста.
     * 
     * @return Promise<void>
     */
    protected async validate(): Promise<void>
    {
        this.checkImportantKeys();
        await this.validateData();
    }
    
    /**
     * @param CommandContext context
     * @return Promise<void>
     */
    public async execute(context: CommandContext): Promise<void>
    {
        this.context = context;

        await this.validate();
        
        await this.handle();
    }

}
