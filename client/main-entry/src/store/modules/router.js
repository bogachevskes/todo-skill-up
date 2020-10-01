import {
    ROUTE_HOME,
    ROUTE_LOGIN,
} from '@router/routes';

const getters = {
    getRoute: () => {
        return (route, params = {}, query = {}, hash = null) => {
            let routeQuery = { name: route };

            if (Object.keys(params).length) {
                routeQuery.params = params;
            }

            if (Object.keys(query).length) {
                routeQuery.query = query;
            }

            if (hash) {
                routeQuery.hash = hash;
            }
            
            return routeQuery;
        };
    },
    getRouteById: (state, getters) => {
        return (route, id = null, query = {}, hash) => {
            
            if (! id && this.$route) {
                id = this.$route.params.id;
            }
            
            return getters.getRoute(route, {id: id}, { ...query }, hash);
        };
    },
    getHomeRoute: function (state, getters) {
        return getters.getRoute(ROUTE_HOME);
    },
    getLoginRoute: function (state, getters) {
        return getters.getRoute(ROUTE_LOGIN);
    },
};

export default {
    getters: getters,
}