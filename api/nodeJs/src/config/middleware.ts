import ProvideCorsMiddleware from '../Framework/Http/Middleware/ProvideCorsMiddleware';
import MiddlewareInterface from '../Framework/Http/Middleware/MiddlewareInterface';
import LogPathMiddleware from '../app/Http/Middleware/LogPathMiddleware';

const middleware: MiddlewareInterface[] = [
    new LogPathMiddleware,
    new ProvideCorsMiddleware,
];

export default middleware;