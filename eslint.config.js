import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['dist/**', 'coverage/**'] },
  ...tseslint.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    ...prettier,
    files: ['**/*.ts'],
    rules: {
      ...prettier.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
