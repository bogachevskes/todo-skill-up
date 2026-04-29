import auth from '@/app/config/middleware/auth';

import { defineNuxtPlugin, useRouter } from '#imports';

type MiddlewareResult = Awaited<ReturnType<typeof auth>>;
type MiddlewareHandler = typeof auth;

const middlewareMap: Record<string, MiddlewareHandler> = {
  auth,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', () => {
    const router = useRouter();

    router.beforeEach(async (to, from): Promise<MiddlewareResult | void> => {
      if (Boolean(to.meta.middleware) === false) {
        return;
      }

      const middlewareChain = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];

      for (const middlewareName of middlewareChain) {
        const middlewareFunction = middlewareMap[middlewareName as string];

        if (Boolean(middlewareFunction) === false) {
          console.warn(`Middleware "${middlewareName}" не найден.`);
          continue;
        }

        const result = await middlewareFunction(to, from);

        if (Boolean(result) === true) {
          return result;
        }
      }
    });
  });
});
