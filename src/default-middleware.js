module.exports = {

  console: function (message, context) {
    context.log = context.log || console
  },

  messenger: function (message, context) {
    context.messenger = {
      timestamp: message.timestamp,
      sender:    message.sender,
      recipient: message.recipient,
      message
    }
  },

  postback: function postback (message, context) {
    if (!message.postback) return

    const data = message.postback
    context.referral = data.referral
    Object.assign(context, parsePayload(data.payload))
    context.topic = `postback${context.topic ? ('.' + context.topic) : ''}`
  },

  message: function message (message, context) {
    if (!message.message) return

    const data = message.message
    if (data.quick_reply) {
      Object.assign(context, parsePayload(data.quick_reply.payload))
      context.topic = `quick_reply${context.topic ? ('.' + context.topic) : ''}`
      return
    }

    /* istanbul ignore else */
    if (data.text) {
      context.topic = 'text'
      context.data = data.text
    }
  },

  referral: function referral (message, context) {
    if (!message.referral) return

    context.topic = 'referral'
    context.data  = message.referral
  }
}

/**
 * parse a string in the format `topic[:data]`, where `data` is valid JSON
 *
 * @param  {[type]} message a string in the format topic[:data], e.g.
 *                          `nextPage` or `gotoPage:{"pageNumber":2}`
 * @return {[type]} { topic, data }
 */
function parsePayload (message) {
  const messageParts = message && message.match(/^([^:]+)(?::(.*))?/)
  if (!messageParts) return {
    topic: undefined,
    data:  undefined
  }

  const topic = messageParts[1]
  let   data = messageParts[2]

  if (data) {
    try {
      data = JSON.parse(data)
    } catch (error) {
      data = undefined
    }
  }

  return {
    topic,
    data
  }
}
