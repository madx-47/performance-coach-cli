// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // CLI tool needs console
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  }
);
