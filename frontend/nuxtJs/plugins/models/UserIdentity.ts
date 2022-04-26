import CommandContext from '../base/CommandContext';

export default class UserIdentity extends CommandContext
{
    constructor()
    {
        super();
        this.setMultiple({
            token: null,
            userId: null,
            groups: [],
            permissions: [],
        });
    }
}