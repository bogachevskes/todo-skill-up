export const state = {
    isActive: false,
    header: null,
    message: null,
};

export const setters = {
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

export default state;