module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:regexp/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: [
    'no-secrets',
    'perfectionist',
    '@typescript-eslint',
    'write-good-comments',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
      node: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        curly: 'off',
        'import/no-unresolved': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'import/newline-after-import': 'warn',
        'react-native/no-inline-styles': 'off',
        'react-native/no-unused-styles': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'write-good-comments/write-good-comments': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        'no-secrets/no-secrets': [
          'error',
          {
            ignoreContent: ['error', '([a-zA-Z0-9]+\\.)+[a-zA-Z0-9]+'],
          },
        ],
        'perfectionist/sort-imports': [
          'warn',
          {
            type: 'line-length',
            tsconfigRootDir: '.',
            fallbackSort: {type: 'alphabetical', order: 'desc'},
            groups: [
              ['side-effect', 'side-effect-style'],
              ['builtin', 'builtin-type'],
              ['react', 'react-native'],
              ['react-type', 'react-native-type'],
              'external',
              'external-type',
              ['internal'],
              'internal-type',
              ['index', 'parent', 'sibling'],
              ['index-type', 'parent-type', 'sibling-type'],
              'object',
              'unknown',
            ],
            customGroups: {
              value: {
                react: ['^react$'],
                'react-native': ['^react-native$'],
              },
              type: {
                'react-type': ['^react$'],
                'react-native-type': ['^react-native$'],
              },
            },
          },
        ],
      },
    },
  ],
};
