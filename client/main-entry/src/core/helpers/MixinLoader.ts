import Vue from 'vue';

export default class MixinLoader {
    public static load (mixins: Function[]) {
        Vue.mixin({
            beforeCreate() {
                const options = this.$options;
        
                const mixinsNames = Object.keys(mixins);
                
                for (const mixin of mixinsNames) {
        
                    const mixinName = '$' + mixin;
                    
                    if (options[mixin]) {
                        this[mixinName] = options[mixin];
            
                        return;
                    }
                    
                    if (options.parent && options.parent[mixinName]) {
                        this[mixinName] = options.parent[mixinName];
            
                        return;
                    }
                }
            },
        });
    }
}