import RoutesCollection from '../Framework/Http/Router/RoutesCollection';
import Route from '../Framework/Http/Router/Route';

import SiteController from '../app/Http/Controllers/SiteController';

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
        'GET',
        '/hi',
        SiteController,
        'actionHi'
    ),
);

export default RoutesCollection;