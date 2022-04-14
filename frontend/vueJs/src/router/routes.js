const ROUTE_HOME = 'home';
const ROUTE_LOGIN = 'login';
const ROUTE_TODO_LIST = 'todo-list';
const ROUTE_USERS_TODOES_LIST = 'user-todoes-list';
const ROUTE_CREATE_USER = 'create-user';
const ROUTE_UPDATE_USER = 'update-user';
const ROUTE_SHOW_TODO_ACCESS_GROUP = 'todo-access-group';

import Home from '@common-components/Home';
import LoginPage from '@common-components/LoginPage';
import InviteActions from '@login-page-components/InviteActions';
import TodoListPage from '@common-components/todo/List';
import Manage from '@common-components/manage/Manage';
import UsersTodoes from '@common-components/manage/components/UsersTodoes';
import Users from '@common-components/manage/components/Users';
import CreateUser from '@common-components/manage/components/CreateUser';
import UpdateUser from '@common-components/manage/components/UpdateUser';
import AccessGroupList from '@common-components/access-groups/List';

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
        path: `/${ROUTE_SHOW_TODO_ACCESS_GROUP}/:id`,
        name: ROUTE_SHOW_TODO_ACCESS_GROUP,
        components: {
            default: AccessGroupList,
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
            {
                path: 'create-user',
                name: ROUTE_CREATE_USER,
                component: CreateUser,
            },
            {
                path: 'update-user/:id',
                name: ROUTE_UPDATE_USER,
                component: UpdateUser,
            },
        ]
    }
];

export {
    ROUTE_HOME,
    ROUTE_LOGIN,
    ROUTE_TODO_LIST,
    ROUTE_USERS_TODOES_LIST,
    ROUTE_CREATE_USER,
    ROUTE_UPDATE_USER,
    ROUTE_SHOW_TODO_ACCESS_GROUP,
    routes,
};