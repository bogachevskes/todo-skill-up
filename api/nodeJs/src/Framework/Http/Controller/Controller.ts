import ControllerInterface from './ControllerInterface';

export default class Controller implements ControllerInterface
{
    /**
     * @type Controller
     */
    public static instance: Controller;

    /**
     * @return Controller
     */
    public static getInstance(): Controller
    {
        if (! (this.instance instanceof Controller)) {
            this.instance = new this;
        }

        return this.instance;
    }
}