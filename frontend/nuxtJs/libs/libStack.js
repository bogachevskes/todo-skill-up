import { MIN_PASSWORD_LENGTH, MIN_NAME_LENGTH } from '@/constants/validation';
import { validationMixin } from 'vuelidate';

/**
 * aka inputTraits
 */
const inputMethods = {
    printIsOnWarning: function (hasError) {
        return {
            'is-danger': hasError,
        };
    },
    blurField: function (filed) {
        if (typeof filed === 'string') {
            this.$v[filed].$touch();

            return this;
        }

        if (Array.isArray(filed)) {
            let input = this.$v;

            for (let level of filed) {
                input = input[level];
            }

            input.$touch();
        }

        return this;
    },
    setOnLoading: function (prop = 'onLoading') {
        this[prop] = true;

        return this;
    },
    setOffLoading: function (prop = 'onLoading') {
        this[prop] = false;

        return this;
    }
};

const inputComputedMethods = {
    getNameMinLength: () => {
        return MIN_NAME_LENGTH;
    },
    getPasswordMinLength: () => {
        return MIN_PASSWORD_LENGTH;
    },
};

const validationMixinAsset = {
    mixins: [validationMixin],
};

export { inputMethods, inputComputedMethods, validationMixinAsset };