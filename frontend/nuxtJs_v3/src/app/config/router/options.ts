import { SignInPage } from '@/pages/auth/sign-in';
import { SignUpPage } from '@/pages/auth/sign-up';
import { BoardDetailsPage, BoardsListPage } from '@/pages/boards';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

import { useRuntimeConfig } from '#imports';

import type { RouterConfig } from '@nuxt/schema';

const routerOptions: RouterConfig = {
  routes: () => {
    const config = useRuntimeConfig();

    return [
      {
        component: HomePage,
        name: 'home',
        path: `${config.public.basePath}`,
      },
      {
        component: BoardsListPage,
        meta: {
          middleware: 'auth',
        },
        name: 'boardsList',
        path: `${config.public.basePath}/boards`,
      },
      {
        component: BoardDetailsPage,
        meta: {
          middleware: 'auth',
        },
        name: 'singleBoard',
        path: `${config.public.basePath}/boards/:id`,
      },
      {
        component: SignInPage,
        name: 'signin',
        path: `${config.public.basePath}/signin`,
      },
      {
        component: SignUpPage,
        name: 'signUp',
        path: `${config.public.basePath}/signup`,
      },
      {
        component: NotFoundPage,
        path: '/:pathMatch(.*)*',
      },
    ];
  },
};

export default routerOptions;
