import { createClient, RedisClientType } from 'redis';

export default class RedisConnection
{
    private static client: RedisClientType;

    constructor(host: string = '127.0.0.1', port: number = 6379, userName: string|null = null, password: string|null = null)
    {
        const auth = userName !== null ? `${userName}:${password}@` : '';
        
        RedisConnection.client = createClient({ url: `redis://${auth}${host}:${port}` });
    }

    static getClient(): RedisClientType
    {
        return RedisConnection.client;
    }
}