import "reflect-metadata";
import * as TypeOrmConnection from 'typeorm';
import RedisConnection from '../app/Services/RedisConnection';
import Router from '../Framework/Http/Router/Router';
import Kernel from '../Framework/Http/Kernel';
import Middleware from '../config/middleware';
import BaseMiddleware from '../Framework/Http/Middleware/Middleware';
import ErrorMiddleware from '../config/errorMiddleware';
import ConfigService from '../Framework/Utils/ConfigService';
import DIContainer from "../Framework/Container/DIContainer";
import {Request} from "express";
import User from "../app/Entity/User";
import NotFound from "../Framework/Exceptions/NotFound";
import UserRepository from "../app/Repository/UserRepository";

DIContainer.create({
    AuthOnlyMiddleware: class extends BaseMiddleware {
        async handle(req: Request): Promise<void>
        {
            const email: string = String(req.get('X-BASE-AUTH'));

            const user: User|null = await (new UserRepository).findByEmail(email);

            if (user === null) {
                throw new NotFound('Пользователь не найден');
            }

            req['user'] = user;
        }
    },
    PasswordHasher: class {
        async hash(input: string, length: number = 12): Promise<string>
        {
            return Buffer.from(input).toString('base64');
        }

        async verify(input: string, hash: string): Promise<boolean>
        {
            return await this.hash(input) === hash;
        }
    },
});

import Routes from '../routes/web';

const router: Router = new Router();

router.configureRoutes(
        Routes.all()
    );

const kernel = new Kernel;

kernel.setMiddleware(Middleware);

kernel.setRouter(router);

kernel.setErrorMiddleware(ErrorMiddleware);

const PORT = ConfigService.getPort();

(async () => {
    
    try {

        new RedisConnection(
                ConfigService.get('REDIS_HOST'),
                ConfigService.get('REDIS_PORT')
            );

        RedisConnection.getClient()
            .on('error', (err): never => {
                throw err
            });

        await RedisConnection.getClient()
            .connect();

        await TypeOrmConnection.createConnection();

        await kernel.handle(PORT);

    } catch (err) {

        console.log("\x1b[31m", `Ошибка при инициализации: ${err.message}`, "\x1b[0m");

        kernel.terminate();

    }
    
})();

