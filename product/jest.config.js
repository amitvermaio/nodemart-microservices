const config = {
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/__test__/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};

export default config;
