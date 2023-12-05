import Configurable from '../base/Configurable';

export default class Board extends Configurable
{
    public id: number | undefined;

    public name: string | undefined;

    public description: string | undefined;

    public createdAt: string | undefined;

    public updatedAt: string | undefined;
}
