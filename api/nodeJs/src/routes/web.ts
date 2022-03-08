import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import Route from '../Framework/Http/Router/Route';

import AuthController from '../app/Http/Controllers/AuthController';

RoutesCollection.add(
    new Route(
        'POST',
        '/auth/login',
        AuthController,
        'actionLogin'
    ),
);

RoutesCollection.add(
    new Route(
        'PUT',
        '/auth/signup',
        AuthController,
        'actionSignup'
    ),
);

export default RoutesCollection;