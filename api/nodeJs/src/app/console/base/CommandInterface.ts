import CommandContext from './CommandContext';

export default interface CommandInterface
{
    execute(context: CommandContext): void;
}