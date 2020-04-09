'use strict'

module.exports = {
  extends: [
    require.resolve('eslint-config-standard'),
    'plugin:security/recommended'
  ],
  plugins: ['security', 'mocha', 'no-loops', 'this'],
  rules: {
    strict: ['error'],
    'this/no-this': 'error',
    'no-loops/no-loops': 2,
    'mocha/handle-done-callback': 'error',
    'mocha/max-top-level-suites': ['warn', { limit: 2 }],
    'mocha/no-identical-title': 'error',
    'mocha/no-synchronous-tests': 'error',
    'prefer-arrow-callback': 0,
    'mocha/valid-suite-description': ['warn', '^[A-Z]'],
    'mocha/valid-test-description': ['warn', '^[a-z]'],
    'mocha/prefer-arrow-callback': 2,
    'mocha/no-return-and-callback': 'error'
  },
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    mocha: true
  }
}
