import { defineConfig } from 'eslint/config';
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  { ignores: ['dist', 'node_modules'] },

  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@eslint-react/no-missing-key': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/exhaustive-deps': 'off',
    },
  },

  eslintConfigPrettier,
]);
