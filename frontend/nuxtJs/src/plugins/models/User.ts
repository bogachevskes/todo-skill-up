import CommandContext from '../base/CommandContext';

export default class User extends CommandContext
{
    constructor() {
        super();
        this.setMultiple({
            token: null,
            userId: null,
            permissions: [],
        });
    }
}
