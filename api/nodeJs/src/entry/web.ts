import "reflect-metadata";
import * as TypeOrmConnection from 'typeorm';
import RedisConnection from '../app/Services/RedisConnection';
import Router from '../Framework/Http/Router/Router';
import Kernel from '../Framework/Http/Kernel';
import Routes from '../routes/web';
import Middleware from '../config/middleware';
import ErrorMiddleware from '../config/errorMiddleware';
import ConfigService from '../Framework/Utils/ConfigService';

const router = new Router();

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

