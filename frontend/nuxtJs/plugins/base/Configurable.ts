export default abstract class Configurable {
    public constructor(parameters: object = {}) {
        this.configure(parameters);
    }

    /**
     * @param  parameters object
     * @return void
     */
    protected configure(parameters: object): void {
        Object.assign(this, parameters);
    }
}
