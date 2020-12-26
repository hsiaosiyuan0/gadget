module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: [
    // priority from low to high
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['**/*.js', '**/*.less'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'jsdoc/check-tag-names': 0,
    'no-bitwise': 0,
    'jsdoc/require-param-description': 0,
    'no-undef': 0,
    'no-inner-declarations': 0,
    'quote-props': 0,
    '@typescript-eslint/no-var-requires': 0,
  },
};
