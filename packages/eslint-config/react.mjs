import globals from 'globals';

import { baseConfig } from './base.mjs';

export const reactConfig = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 'off',
    },
  },
];
