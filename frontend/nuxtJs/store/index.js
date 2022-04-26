export const actions = {
    nuxtClientInit({ dispatch, getters }, context) {
        
        dispatch('todoes/setUserData', context.$userStorage.getUserData());

        if (getters['todoes/isLogged']) {
            dispatch('todoes/updateToken');
            dispatch('todoes/updatePermissions', context.$userStorage);
            dispatch('todoes/updateTodoAccessGroups', context.$userStorage);
        }
    }, 
    nuxtServerInit({ dispatch, getters }, context) {
        
        dispatch('todoes/setUserData', context.$userStorage.getUserData());

        if (getters['todoes/isLogged']) {
            dispatch('todoes/updateToken');
            dispatch('todoes/updatePermissions', context.$userStorage);
            dispatch('todoes/updateTodoAccessGroups', context.$userStorage);
        }
    }, 
}