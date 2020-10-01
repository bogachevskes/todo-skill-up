const state = {
    isActive: false,
    header: null,
    message: null,
};

const setters = {
    showModal: function () {
        this.isActive = true;

        return this;
    },
    hideModal: function (callback = null) {
        this.isActive = false;

        try {
            this.unsetModalInfo();
        } catch (e) { }

        return this;
    },
};

export {state, setters};