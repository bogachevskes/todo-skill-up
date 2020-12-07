import Configurable from '../base/Configurable';
import Executable from '../base/Executable';
import CommandContext from '../base/CommandContext';
import RenderCommand from './commands/RenderCommand';

export default class Renderer extends Configurable
{
    private static instance: Renderer;

    protected rendererCommand: Executable;

    protected context: CommandContext;

    protected constructor(parameters: object = {})
    {
        super(parameters);

        this.context = new CommandContext;
        
        this.rendererCommand = new RenderCommand;
    }

    static getInstance(): Renderer
    {
        if (this.instance instanceof Renderer) {
            return this.instance;
        }

        this.instance = new Renderer();

        return this.instance;
    }

    public static renderIndexFile(): void
    {
        const instance = this.getInstance();

        instance.context.set('fileName', 'index');

        instance.rendererCommand.execute(instance.context);
    }
}