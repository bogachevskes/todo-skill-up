import { createClient, RedisClientType } from 'redis';

export default class RedisConnection
{
    /**
     * @var RedisClientType
     */
    private static client: RedisClientType;

    constructor(host: string = '127.0.0.1', port: number = 6379, userName: string|null = null, password: string|null = null)
    {
        const auth = userName !== null ? `${userName}:${password}@` : '';
        
        RedisConnection.client = createClient({ url: `redis://${auth}${host}:${port}` });
    }

    /**
     * @returns _RedisClientType
     */
    static getClient(): RedisClientType
    {
        return RedisConnection.client;
    }
}