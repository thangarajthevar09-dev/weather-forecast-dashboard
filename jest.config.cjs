
module.exports = {
  testEnvironment: "jsdom",

  testMatch: ["**/?(*.)+(test).[jt]sx"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },

  moduleFileExtensions: ["js", "jsx", "json"],

  testPathIgnorePatterns: ["/node_modules/"],
};
