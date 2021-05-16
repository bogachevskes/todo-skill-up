import Router from './Framework/Http/Router/Router';
import Kernel from './Framework/Http/Kernel';
import Routes from './routes/web';

const router = new Router();

router.configure(
        Routes.all()
    );

const kernel = new Kernel;

kernel.setRouter(router);

(async () => {
    await kernel.handle();
})();

