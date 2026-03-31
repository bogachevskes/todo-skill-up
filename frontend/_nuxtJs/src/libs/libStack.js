import { validationMixin } from 'vuelidate';
import { MIN_PASSWORD_LENGTH, MIN_NAME_LENGTH } from '@/constants/validation';

/**
 * aka inputTraits
 */
const inputMethods = {
    printIsOnWarning (hasError) {
        return {
            'is-danger': hasError,
        };
    },
    blurField (filed) {
        if (typeof filed === 'string') {
            this.$v[filed].$touch();

            return this;
        }

        if (Array.isArray(filed)) {
            let input = this.$v;

            for (const level of filed) {
                input = input[level];
            }

            input.$touch();
        }

        return this;
    },
    setOnLoading (prop = 'onLoading') {
        this[prop] = true;

        return this;
    },
    setOffLoading (prop = 'onLoading') {
        this[prop] = false;

        return this;
    },
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
