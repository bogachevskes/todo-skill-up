const ROUTE_HOME = 'home';
const ROUTE_LOGIN = 'login';
const ROUTE_TODO_LIST = 'todo-list';

import Home from '@common-components/Home';
import LoginPage from '@common-components/LoginPage';
import InviteActions from '@login-page-components/InviteActions';
import TodoListPage from '@common-components/todo/List'

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
    },
    {
        path: '/todo-list',
        name: ROUTE_TODO_LIST,
        components: {
            default: TodoListPage,
        },
    }
];

export {
    ROUTE_HOME,
    ROUTE_LOGIN,
    ROUTE_TODO_LIST,
    routes,
};