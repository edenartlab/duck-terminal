module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',

    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-redeclare': 'error',
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase', 'UPPER_CASE'],
      },
    ],
    'no-console': [
      'warn',
      { allow: ['warn', 'error', 'info', 'time', 'timeEnd'] },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message:
              "Import from 'lodash/<package>' directly to support tree-shaking.",
          },
        ],
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  ignorePatterns: [
    '**/*.js',
    '**/*.json',
    'node_modules',
    'public',
    'styles',
    '.next',
    'coverage',
    'dist',
    '.turbo',
  ],
}
