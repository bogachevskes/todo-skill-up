const ROUTE_HOME = 'home';
const ROUTE_LOGIN = 'login';

import Home from '@common-components/Home';
import LoginPage from '@common-components/LoginPage';
import InviteActions from '@login-page-components/InviteActions';

const routes = [
    {
        path: '/',
        name: ROUTE_HOME,
        components: {
            default: Home,
            'invite-actions': InviteActions,
        },
    },
    {
        path: '/login',
        name: ROUTE_LOGIN,
        components: {
            default: LoginPage,
            'invite-actions': InviteActions,
        },
    }
];

export {
    ROUTE_HOME,
    ROUTE_LOGIN,
    routes,
};