import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const fsdPublicApiPatterns = [
  '@/**/api/**',
  '@/**/lib/**',
  '@/**/model/**',
  '@/**/ui/**',
  '~/**/api/**',
  '~/**/lib/**',
  '~/**/model/**',
  '~/**/ui/**',
];

export default [
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.min.js',
    ],
  },
  js.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/comma-spacing': ['error', {
        after: true,
        before: false 
      }],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/key-spacing': ['error', {
        afterColon: true,
        beforeColon: false 
      }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': ['error', {
        after: true,
        before: false 
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/template-curly-spacing': ['error', 'never'],
      camelcase: ['error', { properties: 'never' }],
      curly: ['error', 'all'],
      'default-param-last': 'error',
      eqeqeq: ['error', 'always'],
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [
            {
              group: 'internal',
              pattern: '@/**',
              position: 'before',
            },
            {
              group: 'internal',
              pattern: '~/**',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'no-array-constructor': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-eval': 'error',
      'no-inner-declarations': ['error', 'functions'],
      'no-multi-str': 'error',
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 1 
      }],
      'no-object-constructor': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: fsdPublicApiPatterns,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "IfStatement > UnaryExpression[operator='!']",
          message: 'Используйте явное сравнение в условиях if.',
        },
      ],
      'no-shadow-restricted-names': 'error',
      'no-tabs': 'error',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 2,
            consistent: true 
          },
          ObjectPattern: {
            multiline: true,
            consistent: true 
          },
        },
      ],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      'prefer-template': 'error',
      'use-isnan': 'error',
      yoda: ['error', 'never'],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        projectService: true,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'parameter'],
          types: ['boolean'],
          format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
          prefix: ['is'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-closing-bracket-spacing': ['error', { selfClosingTag: 'always' }],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/html-quotes': ['error', 'double'],
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-lifecycle-after-await': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/no-reserved-component-names': ['error', { disallowVueBuiltInComponents: true }],
      'vue/no-reserved-props': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-unused-properties': ['error', { groups: ['props'] }],
      'vue/no-unused-refs': 'error',
      'vue/no-watch-after-await': 'error',
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/require-v-for-key': 'error',
    },
  },
  {
    files: ['src/app.vue', 'src/error.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        projectService: true,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'parameter'],
          types: ['boolean'],
          format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
          prefix: ['is'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',
    },
  },
];
