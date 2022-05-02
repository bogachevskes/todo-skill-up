export const state = {
    isActive: false,
    header: null,
    message: null,
};

export const setters = {
    showModal () {
        this.isActive = true;

        return this;
    },
    hideModal (callback = null) {
        this.isActive = false;

        try {
            this.unsetModalInfo();
        } catch (e) {}

        return this;
    },
};

export default state;
