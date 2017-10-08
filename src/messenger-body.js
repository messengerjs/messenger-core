/* eslint-disable operator-linebreak */

const _ = {
  cloneDeep: require('lodash.clonedeep')
}

const defaultMiddleware = require('./default-middleware')

module.exports = function MessengerBodyProcessor (options) {
  const middleware = []
  processMessengerBody.use = use

  const log = (options && options.log) || console
  use(function optionsCustomLogger (message, context) {
    context.log = log
  })

  Object
    .keys(defaultMiddleware)
    .forEach(key => use(defaultMiddleware[key]))

  return processMessengerBody

  /**
   * Process messages from Facebook Messenger.
   *
   * @param  {object}   body               _parsed_ JSON HTTP message body.
   * @param  {function} beforeMiddlewareFn optional function to call before executing
   *                                       any plugins.
   * @return {boolean}                     + `true` if the Message was processed
   *                                       + `false` if the body didn't contain
   *                                          Messenger messages
   */
  async function processMessengerBody (body, context) {
    const allMessages = getAllMessages(body)
    if (!allMessages || !allMessages.length) return false

    context = context || {}

    for (let message of allMessages) {
      message = _.cloneDeep(message)
      const messageContext = Object.assign({}, context)
      try {
        for (let plugin of middleware) {
          await plugin(message, messageContext)
        }
      } catch (error) {
        const logError = (messageContext.log && messageContext.log.error instanceof Function)
          ? messageContext.log.error
          : console.error
        logError('Error running middleware', error)
      }
    }
    return true
  }

  function use (plugin) {
    middleware.push(plugin)
    return processMessengerBody
  }
}

function getAllMessages (body) {
  return body
    && body.object === 'page'
    && Array.isArray(body.entry)
    && body.entry.reduce((allMessages, entry) => {
      if (Array.isArray(entry.messaging)) Array.prototype.push.apply(allMessages, entry.messaging)
      return allMessages
    }, [])
}
