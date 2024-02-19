export default class DIContainer
{
    protected static instance: DIContainer|null = null;

    protected constructor(private config: object) { }

    public static create(config: object): void
    {
        if (this.instance !== null) {
            throw new Error('Повторное конфигурирование контейнера недоступно. Контейнер сконфигурирован ранее');
        }

        this.instance = new this(config);
    }

    protected static has(id: Function): boolean
    {
        return this.getInstance().config.hasOwnProperty(id.name);
    }

    public static getDefinition(id: Function): Function
    {
        if (this.has(id) === false) {
            throw new Error(`Отсутствует зависимость ${id.name}`);
        }

        return this.getInstance().config[id.name];
    }

    public static get<T>(id: Function): T
    {
        if (this.has(id) === false) {
            throw new Error(`Отсутствует зависимость ${id.name}`);
        }

        const dependency = this.getInstance().config[id.name];

        return eval(`new dependency`);
    }

    public static getInstance(): DIContainer
    {
        if (this.instance === null) {
            throw new Error('Контейнер внедрения зависимостей не сконфигурирован');
        }

        return this.instance;
    }
}