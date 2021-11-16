module.exports = {
    extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
    rules: {
      "prettier/prettier": ["error", { "singleQuote": true, "trailingComma": "all", }],
    }
  };