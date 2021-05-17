import JsonParserMiddleware from '../Framework/Http/Middleware/JsonParserMiddleware';
import ProvideCorsMiddleware from '../Framework/Http/Middleware/ProvideCorsMiddleware';
import MiddlewareInterface from '../Framework/Http/Middleware/MiddlewareInterface';
import DefaultMiddleware from '../app/Http/Middleware/DefaultMiddleware';

const middleware: MiddlewareInterface[] = [
    new JsonParserMiddleware,
    new DefaultMiddleware,
    new ProvideCorsMiddleware,
];

export default middleware;