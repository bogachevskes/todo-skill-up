import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Nuxt framework entrypoints/adapters live outside FSD layers.
    ignores: [
      './src/assets/**',
      './src/middleware/**',
      './src/plugins/**',
      './src/public/**',
      './src/app.vue',
      './src/error.vue',
    ],
  },
  {
    // In this project these checks are too noisy and conflict with the accepted local structure.
    rules: {
      'fsd/insignificant-slice': 'off',
      'fsd/no-reserved-folder-names': 'off',
    },
  },
]);
