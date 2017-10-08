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

  parsePayload: function (message, context) {
    const messageType = createContextFnsKeys
      .find(attr => message[attr]) || 'other'

    const createContext = createContextFns[messageType]
    if (!createContext) return

    Object.assign(context, createContext(message[messageType]))
  },

  topic: function (message, context) {
    const messageType = createContextFnsKeys
      .find(attr => message[attr]) || 'other'
    context.topic = `${messageType}${context.topic ? ('.' + context.topic) : ''}`
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

const createContextFns = {
  postback: function postback (data) {
    const context = parsePayload(data.payload)
    context.referral = data.referral
    return context
  },

  quick_reply: function quickReply (data) {
    return parsePayload(data.payload)
  },

  text: function text (data) {
    return {
      data
    }
  },

  referral: function referral (data) {
    return {
      data
    }
  }
}

const createContextFnsKeys = Object.keys(createContextFns)
