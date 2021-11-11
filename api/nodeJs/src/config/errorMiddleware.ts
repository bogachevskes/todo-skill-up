import ErrorMiddlewareInterface from '../Framework/Http/Middleware/ErrorMiddlewareInterface';
import ErrorMiddleware from '../Framework/Http/Middleware/ErrorMiddleware';

const middleware: ErrorMiddlewareInterface[] = [
    new ErrorMiddleware,
];

export default middleware;