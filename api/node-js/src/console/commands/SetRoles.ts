import CommandInterface from '../base/CommandInterface';
import CommandContext from '../base/CommandContext';

export default class SetRoles implements CommandInterface
{
    public execute(context: CommandContext): void
    {
        console.log(console.log(context));
    }
}