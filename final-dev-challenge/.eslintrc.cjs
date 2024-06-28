module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prefer-arrow', 'simple-import-sort'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        // Tailwindcss
        'tailwindcss/classnames-order': [
          2,
          {
            callees: ['cn', 'cva', 'clsx'],
          },
        ],
        // Enforce arrow functions
        'prefer-arrow/prefer-arrow-functions': [
          'error',
          {
            disallowPrototype: true,
            singleReturnOnly: true,
            classPropertiesAllowed: false,
          },
        ],
        // Sort
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Side effects first e.g. 'server-only'
              ['^\\u0000'],
              // react, next
              ['^(react)'],
              // arweave
              ['^(arweave|@permaweb/aoconnect|arweave-wallet-kit|arconnect)'],
              // Other npm libraries.
              ['^(~|@)?\\w'],
              // Internal packages
              [
                '^~/core',
                '^~/utils',
                '^~/hooks',
                '^~/machines',
                '^~/pages',
                '^~/components',
              ],

              // Parent imports `..`
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports '.'
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ],
          },
        ],
      },
    },
  ],
};
