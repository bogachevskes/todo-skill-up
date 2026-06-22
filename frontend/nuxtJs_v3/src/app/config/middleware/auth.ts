import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#imports';

export default defineNuxtRouteMiddleware(() => {
  if (Boolean(useCookie('token').value) === false) {
    return navigateTo('/signin');
  }
});
