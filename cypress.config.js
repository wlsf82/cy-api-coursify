const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    env: {
      API_URL: 'https://api.coursify.me/v1',
    },
  },
  fixturesFolder: false,
})
