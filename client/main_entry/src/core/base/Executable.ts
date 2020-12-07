import CommandContext from './CommandContext';

export default interface Executable
{
    execute(context: CommandContext): void
}