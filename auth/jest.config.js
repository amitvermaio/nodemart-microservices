export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.model.js',
    '!src/config/**'
  ],
  transformIgnorePatterns: ['/node_modules/'],
  maxWorkers: 1,
  testTimeout: 30000,
  transform: {}
};
