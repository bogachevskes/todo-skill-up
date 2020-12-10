const ROUTE_HOME = 'home';
const ROUTE_LOGIN = 'login';
const ROUTE_TODO_LIST = 'todo-list';
const ROUTE_USERS_TODOES_LIST = 'user-todoes-list';

import Home from '@common-components/Home';
import LoginPage from '@common-components/LoginPage';
import InviteActions from '@login-page-components/InviteActions';
import TodoListPage from '@common-components/todo/List';
import Manage from '@common-components/manage/Manage';
import UsersTodoes from '@common-components/manage/components/UsersTodoes';
import Users from '@common-components/manage/components/Users';

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
            'invite-actions': InviteActions,
        },
    },
    {
        path: '/manage',
        components: {
            default: Manage,
            'invite-actions': InviteActions,
        },
        children: [
            {
              path: 'user-todoes-list/:id',
              name: ROUTE_USERS_TODOES_LIST,
              component: UsersTodoes
            },
            {
                path: 'users',
                component: Users,
            },
        ]
    }
];

export {
    ROUTE_HOME,
    ROUTE_LOGIN,
    ROUTE_TODO_LIST,
    ROUTE_USERS_TODOES_LIST,
    routes,
};