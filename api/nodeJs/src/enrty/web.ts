import "reflect-metadata";
import * as typeorm from 'typeorm';
import Router from '../Framework/Http/Router/Router';
import Kernel from '../Framework/Http/Kernel';
import Routes from '../routes/web';
import ConfigService from '../Framework/Utils/ConfigService';

const router = new Router();

router.configure(
        Routes.all()
    );

const kernel = new Kernel;

kernel.setRouter(router);

const PORT = ConfigService.getPort();

(async () => {
    await typeorm.createConnection();

    await kernel.handle(PORT);
    kernel.terminate();
})();

