import InvalidArgumentException from '../base/Exceptions/InvalidArgumentException';
import Configurable from '../base/Configurable';
import serviceConfig from '../config/_common';

export default class ConfigService extends Configurable
{
    protected static instance: ConfigService|null = null;

    /**
     * @param  string key
     * @return number|string
     */
    public static get(key: string): number|string
    {
        const instance = this.getInstance(),
            value = instance[key];
        
        if (value === undefined) {
            throw new InvalidArgumentException(`Key ${key} is not found in configuration`);
        }

        return value;
    }
    
    /**
     * @return ConfigService
     */
    protected static getInstance(): ConfigService
    {
        if (! (this.instance instanceof ConfigService)) {
            this.instance = new this(serviceConfig);
        }
        
        return this.instance;
    }

}
