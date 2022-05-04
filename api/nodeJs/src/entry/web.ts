import "reflect-metadata";
import * as Connection from 'typeorm';
import Router from '../Framework/Http/Router/Router';
import Kernel from '../Framework/Http/Kernel';
import Routes from '../routes/web';
import Middleware from '../config/middleware';
import ErrorMiddleware from '../config/errorMiddleware';
import ConfigService from '../Framework/Utils/ConfigService';

const result = require('dotenv').config({path: `${process.env.INIT_CWD}/dist/.env`});

if (Boolean(result.error) === true) {
    throw result.error;
}

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

        await Connection.createConnection();

        await kernel.handle(PORT);

    } catch (err) {

        console.log("\x1b[31m", `Ошибка при инициализации: ${err.message}`, "\x1b[0m");

        kernel.terminate();

    }
    
})();

