export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
  extensionsToTreatAsEsm: ['.js'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.js'],
  haste: {
    forceNodeFilesystemAPI: true,
  },
};