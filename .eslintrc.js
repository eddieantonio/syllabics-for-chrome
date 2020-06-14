module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  globals: {
    chrome: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-use-before-define': ['error', { functions: false }],
  },
};
