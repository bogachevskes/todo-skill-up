export const state = () => ({
    onRegistration: true,
});

export const getters = {
    onRegistration(state) {
        return state.onRegistration;
    }
};

export const mutations = {
    setOnRegistration (state, onRegistration) {
        state.onRegistration = onRegistration;
    },
};

export const actions = {
    setOnRegistration ({ commit }, onRegistration) {
        commit('setOnRegistration', onRegistration);
    },
};
