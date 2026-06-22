import { SignInPage } from '@/pages/auth/sign-in';
import { SignUpPage } from '@/pages/auth/sign-up';
import { BoardDetailsPage, BoardsListPage } from '@/pages/boards';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { TermsPage } from '@/pages/terms';

import type { RouterConfig } from '@nuxt/schema';

const routerOptions: RouterConfig = {
  routes: () => [
    {
      component: HomePage,
      name: 'home',
      path: '/',
    },
    {
      component: BoardsListPage,
      meta: {
        middleware: 'auth',
      },
      name: 'boardsList',
      path: '/boards',
    },
    {
      component: BoardDetailsPage,
      meta: {
        middleware: 'auth',
      },
      name: 'singleBoard',
      path: '/boards/:id',
    },
    {
      component: SignInPage,
      name: 'signin',
      path: '/signin',
    },
    {
      component: SignUpPage,
      name: 'signUp',
      path: '/signup',
    },
    {
      component: TermsPage,
      name: 'terms',
      path: '/terms',
    },
    {
      component: NotFoundPage,
      path: '/:pathMatch(.*)*',
    },
  ],
};

export default routerOptions;
