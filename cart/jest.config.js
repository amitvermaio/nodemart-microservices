export default {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/__test__/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000,
  testMatch: ['**/src/__test__/**/*.test.js'],
};