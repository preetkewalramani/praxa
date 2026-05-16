import globals from 'globals';

import { baseConfig } from './base.mjs';

export const nestJsConfig = [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/class-methods-use-this': 'off',
    },
  },
];
