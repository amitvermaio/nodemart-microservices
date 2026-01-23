export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  haste: {
    forceNodeFilesystemAPI: true,
  }
};
