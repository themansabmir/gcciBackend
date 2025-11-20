const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  }
);
