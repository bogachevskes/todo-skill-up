import CommandContext from './base/CommandContext';
import CommandInterface from './base/CommandInterface';

const COMMAND_NAME_POSITION = 2;

export default class CommandKernel
{
    protected args: any[];
    
    protected commandName: string;
    
    protected context: CommandContext;
    
    protected command: CommandInterface;

    protected commandsList: object;

    /**
     * Инициализация ввода.
     * 
     * @return void
     */
    protected resolveCommandName(): void
    {
        for (const arg in this.args) {
            if (parseInt(arg) === COMMAND_NAME_POSITION) {
                this.commandName = this.args[arg];
            }
        }

        if (! this.commandName) {
            throw new Error('Имя команды не определено');
        }
    }

    /**
     * Загрузка конфигурации команд.
     * 
     * @param  knownCommands
     * @return void
     */
    protected loadCommandList(knownCommands: object)
    {
        this.commandsList = knownCommands;
    }

    /**
     * Определение объекта команды.
     * 
     * @return void
     */
    protected defineCommand(): void
    {
        if (! (this.commandName in this.commandsList)) {
            throw new Error('Команда не найдена');
        }

        this.command = new (this.commandsList[this.commandName]);
    }

    /**
     * Подготовка контекста.
     * 
     * @return void
     */
    protected buildContext(): void
    {
        this.context = new CommandContext();

        let offset = COMMAND_NAME_POSITION + 1;
        
        const inputData = this.args.slice(offset);

        const equalExpression = new RegExp('\=');

        for (const key in inputData) {
            const input = inputData[key];
            
            if (! input.match(equalExpression)) {
                this.context.set(key, input);
                continue;
            }

            const inputPair = input.split(equalExpression);

            this.context.set(inputPair[0], inputPair[1]);
        }
    }
    
    /**
     * @param  object knownCommands конфигурация команд
     * @return void
     */
    public handle(knownCommands: object): void
    {
        this.loadCommandList(knownCommands);
        
        this.args = process.argv;
        
        this.resolveCommandName();
        
        this.defineCommand();

        this.buildContext();

        this.command.execute(this.context);
    }

}
