import UserStorageService from './services/UserStorageService';

export default function (ctx, inject) {
    const userStorage = new UserStorageService();

    userStorage.axios = ctx.$axios;

    if (
        Boolean(process.server) === true &&
        ctx.req.headers.cookie !== undefined
    ) {
        userStorage.fillCookies(String(ctx.req.headers.cookie));
    }

    inject('userStorage', userStorage);
}
