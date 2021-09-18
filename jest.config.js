module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: [
    'js',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  setupFiles: [
    'fake-indexeddb/auto'
  ],
  testMatch: ['**/tests/**/*.spec.js'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,vue}',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/vue.config.js',
    '!**/hot-reload.js',
    '!**/abi.js',
    '!**/jest.config.js',
    '!**/tests/**',
    '!**/background/**',
    '!**/popup/**',
    '!**/content-script/**',
    '!**/i18n/**',
    '!**/lang/**',
    '!**/router/**',
    '!**/store/**',
    '!**/dist/**',
    '!**/coverage/**'
  ]
}
