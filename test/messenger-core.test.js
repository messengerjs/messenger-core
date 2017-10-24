const _ = {
  get:  require('lodash.get'),
  noop: require('lodash.noop')
}

const sinon = require('sinon')

const expect = require('chai').expect
const MessengerCore = require('../src/messenger-core')

describe('MessengerCore', function () {
  describe('iniztialization', function () {

    it('should return a function', function () {
      expect(MessengerCore()).to.be.instanceof(Function)
    })

    it('should accept a custom logger', async function () {
      const customLogger = sinon.spy()
      const messengerCore = MessengerCore({ log: { info: customLogger } })
        .use(function (message, context) {
          context.log.info('Hello')
        })
      await messengerCore(createMessage({}))
      expect(customLogger.called).to.equal(true)
    })
  })

  describe('should return `false` if the body is _not_ a Facebook Messenger Body', async function () {
    it('should return `false` if `body.object !== \'page\'`', async function () {
      const messengerCore = MessengerCore()
      expect(await messengerCore()).to.equal(false)
    })

    it('should return `false` if there are no `messaging` entries (eg webhook page updates)', async function () {
      const messengerCore = MessengerCore()
      expect(await messengerCore({
        object: 'page',
        entry: [{
          id: 'testentry',
          changed_fields: ['testfield']
        }]
      })).to.equal(false)
    })

    it('should return `true` if the body _is_ a Facebook Messenger Body', async function () {
      const messengerCore = MessengerCore()
      expect(await messengerCore(fixtures.oneTextMessage)).to.equal(true)
    })
  })

  describe('plugins', function () {
    beforeEach(function () {
      this.logErrors = []
      this.messengerCore = MessengerCore({
        log: {
          error: Array.prototype.push.bind(this.logErrors)
        }
      })
    })

    it('should have a `use` function', function () {
      expect(this.messengerCore).to.have.property('use').which.is.instanceof(Function)
    })

    it('`use` should be chainable', function () {
      expect(this.messengerCore.use(_.noop)).to.have.property('use').which.is.instanceof(Function)
      expect(this.messengerCore.use(_.noop)).to.equal(this.messengerCore)
    })

    it('should execute all plugins in the order they were added', async function () {
      const array = []
      function addOne () { array.push(array.length + 1) }
      this.messengerCore
        .use(addOne)
        .use(addOne)
        .use(addOne)
        .use(addOne)
        .use(addOne)
        .use(function () {
          expect(array).to.deep.equal([ 1, 2, 3, 4, 5 ])
        })
      this.messengerCore(fixtures.oneTextMessage)
    })

    describe('Error handling', function () {
      const didContinueSpy = sinon.spy(function () {
        if (didContinueSpy.firstCall) throw new Error()
      })
      const didLogSpy = sinon.spy()

      before(async function () {
        const messengerCore = MessengerCore({
          log: { error: didLogSpy }
        })
        messengerCore.use(didContinueSpy)
        await messengerCore(fixtures.twoTextMessages)
      })

      it('should log any errors that occur in plugins', function () {
        expect(didLogSpy.called, 'log any errors that occur in plugins').to.equal(true)
      })

      it('should stop processing the current message; and keep processing remaining messages', async function () {
        expect(didContinueSpy.calledTwice, 'keep processing remaining messages').to.equal(true)
      })

      describe('Logging', function () {
        before(function () {
          this.originalError = console.error
          console.error = sinon.spy()
        })

        after(function () {
          console.error = this.originalError
        })

        it('should log to console on errors if there’s no custom logger', async function () {
          const messengerCore = MessengerCore()
            .use(function (message, context) {
              throw new Error()
            })
          await messengerCore(fixtures.oneTextMessage)
          expect(console.error.called).to.equal(true)
        })

        it('should fallback to console if custom logger’s `error` isn\'t a function', async function () {
          const messengerCore = MessengerCore({ log: { error: 'whatever' } })
            .use(function (message, context) {
              throw new Error()
            })
          await messengerCore(fixtures.oneTextMessage)
          expect(console.error.called).to.equal(true)
        })
      })
    })
  })

  describe('message types', function () {

    beforeEach(function () {
      this.logSpy = sinon.spy()
      this.messengerCore = MessengerCore({
        log: { error: this.logSpy }
      }).use((message, context) => { this.handleMessageContext = context })
      this.get = function (selector) {
        return _.get(this.handleMessageContext, selector)
      }.bind(this)
    })

    describe('postback', function () {

      it('should handle postbacks without JSON payload', async function () {
        await this.messengerCore(fixtures.onePostback)
        expect(this.get('topic')).to.equal('postback.HELLO_WORLD')
      })

      it('should handle postbacks with JSON payload', async function () {
        await this.messengerCore(fixtures.onePostbackWithJSON)
        expect(this.get('data.hello')).to.equal('world')
      })

      it('should handle postbacks with faulty non-JSON payload', async function () {
        await this.messengerCore(fixtures.onePostbackWithFaultyJSON)
        expect(this.get('topic')).to.equal('postback.HELLO_WORLD')
      })

      it('should handle postbacks with undefined/missing payload', async function () {
        await this.messengerCore(fixtures.onePostbackWithUndefinedPayload)
        expect(this.get('topic')).to.equal('postback')
      })
    })

    describe('quick_reply', function () {
      it('should handle quick_reply without any payload', async function () {
        await this.messengerCore(fixtures.oneQuickReplyWithoutPayload)
        expect(this.get('topic')).to.equal('quick_reply')
      })

      it('should handle quick_reply with non-JSON payload', async function () {
        await this.messengerCore(fixtures.oneQuickReply)
        expect(this.get('topic')).to.equal('quick_reply.HELLO_WORLD')
      })

      it('should handle quick_reply with JSON payload', async function () {
        await this.messengerCore(fixtures.oneQuickReplyWithJSON)
        expect(this.get('data.hello')).to.equal('world')
      })

      it('should handle quick_reply with faulty non-JSON payload', async function () {
        await this.messengerCore(fixtures.oneQuickReplyWithFaultyJSON)
        expect(this.get('topic')).to.equal('quick_reply.HELLO_WORLD')
      })
    })

    describe('text', function () {
      it('should handle text', async function () {
        await this.messengerCore(fixtures.oneTextMessage)
        expect(this.get('topic')).to.equal('text')
        expect(this.get('data')).to.equal(
          fixtures.oneTextMessage.entry[0].messaging[0].message.text
        )
      })
    })

    describe('referral', function () {
      it('should handle referrals', async function () {
        await this.messengerCore(fixtures.oneReferral)
        expect(this.get('topic')).to.equal('referral')
        expect(this.get('data')).to.deep.equal(
          fixtures.oneReferral.entry[0].messaging[0].referral
        )
      })
    })
  })
})

function createMessage (...messaging) {
  return {
    object: 'page',
    entry: [ {
      messaging
    }]
  }
}

const fixtures = {
  oneTextMessage:        createMessage({ message: { text : 'Hello, world!' } }),
  twoTextMessages:       createMessage({ message: { text : 'Hello!' } }, { message: { text: 'world!' } }),
  onePostback:           createMessage({ postback   : { payload: 'HELLO_WORLD' } }),
  onePostbackWithJSON:   createMessage({ postback   : { payload: 'HELLO_WORLD:{"hello":"world"}' } }),
  onePostbackWithFaultyJSON:
                         createMessage({ postback   : { payload: 'HELLO_WORLD:thisisntJson' } }),
  onePostbackWithUndefinedPayload:
                         createMessage({ postback   : { payload: undefined } }),
  oneQuickReply:         createMessage({ message: { quick_reply: { payload: 'HELLO_WORLD' } } }),
  oneQuickReplyWithJSON: createMessage({ message: { quick_reply: { payload: 'HELLO_WORLD:{"hello":"world"}' } } }),
  oneQuickReplyWithFaultyJSON:
                         createMessage({ message: { quick_reply: { payload: 'HELLO_WORLD:totallynotjson' } } }),
  oneQuickReplyWithoutPayload:
                         createMessage({ message: { quick_reply: { } } }),
  oneReferral:           createMessage({
    referral: {
      type: 'OPEN_THREAD',
      source: 'MESSENGER_CODE',
      ref: 'whatever'
    }
  })
}
