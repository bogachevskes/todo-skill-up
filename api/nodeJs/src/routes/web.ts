import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import Route from '../Framework/Http/Router/Route';

import SiteController from '../app/Http/Controllers/SiteController';
import AuthController from '../app/Http/Controllers/AuthController';

RoutesCollection.add(
    new Route(
        'GET',
        '/',
        SiteController,
        'actionIndex'
    ),
);

RoutesCollection.add(
    new Route(
        'POST',
        '/auth/login',
        AuthController,
        'actionLogin'
    ),
);

export default RoutesCollection;