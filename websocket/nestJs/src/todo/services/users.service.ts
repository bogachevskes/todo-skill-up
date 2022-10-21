import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import User from '../entities/user.entity';

@Injectable()
export default class UsersService
{
    constructor(
        @InjectRepository(User) private readonly repository: Repository<User>,
        @InjectRedis() private readonly redis: Redis
    ){ }
    
    /**
     * @param id 
     * @returns 
     */
    public async findEntity(id: Number): Promise<User>
    {
        const key = `ws-user-entity-id-${id}`;

        if (await this.redis.exists(key) === 1) {

            const res = await this.redis.get(key);

            const entity = this.repository.create(JSON.parse(res));

            console.log(`Пользователь #${id} получен из редис: ${res}`);

            if (entity instanceof User) {
                
                return entity;
            }

            throw new Error('Неожидаемое поведение при создании сущности');
        }

        const entity = await this.repository.findOne({
                select: ['id', 'name', 'status'],
                where: {
                    id,
                },
            });

        if (entity instanceof User) {
            this.redis.set(key, JSON.stringify(entity), 'EX', 3600);
        }

        console.log(`Пользователь #${id} получен из БД: ${JSON.stringify(entity)}`);

        return entity;
    }
}