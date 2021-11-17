module.exports = {
    extends: ['airbnb-typescript/base', 'plugin:prettier/recommended', 'plugin:mocha/recommended'],
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
    rules: {
      "prettier/prettier": ["error", { "singleQuote": true, "trailingComma": "all", }],
      "mocha/no-mocha-arrows": 0,
      "mocha/no-hooks-for-single-case": 0,
      "mocha/no-setup-in-describe": 0,
      "mocha/no-skipped-tests": 0,
      "mocha/no-exclusive-tests": ["error"],
      "import/no-extraneous-dependencies": 0,
      "no-underscore-dangle": 0
    }
  };