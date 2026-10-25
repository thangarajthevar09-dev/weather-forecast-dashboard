module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-transformer.cjs"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/styleMock.cjs"
  },
  clearMocks: true
};
