import JsonParserMiddleware from '../Framework/Http/Middleware/JsonParserMiddleware';
import ProvideCorsMiddleware from '../Framework/Http/Middleware/ProvideCorsMiddleware';
import DefaultMiddleware from '../app/Http/Middleware/DefaultMiddleware';

export default [
    JsonParserMiddleware,
    DefaultMiddleware,
    ProvideCorsMiddleware,
];