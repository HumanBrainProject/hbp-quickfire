module.exports = {
  "verbose": true,
  "testMatch": ["<rootDir>/src/**/*.test.js"],
  "transform": {
    "^.+\\.jsx?$": "babel-jest"
  },
  "collectCoverageFrom": ["<rootDir>/src/**/*.js"],
  "setupFiles": ["<rootDir>/jest.setup.js"]
};