// playwright.config.js
module.exports = {
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  testDir: 'tests',
};
