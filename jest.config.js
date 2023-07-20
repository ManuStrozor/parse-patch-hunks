module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*.js"],
  coverageThreshold: {
    global: {
      lines: 75,
    },
  },
  verbose: false,
  noStackTrace: true,
};
