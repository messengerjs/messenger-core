const middleware = require('../src/default-middleware')
const expect = require('chai').expect

describe('Default Middleware', function () {
  describe('console', function () {
    it('defaults to console for logging', function () {
      const context = {}
      middleware.console(null, context)
      expect(context.log).to.equal(console)
    })
  })
})
