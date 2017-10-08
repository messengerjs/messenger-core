#  [![NPM version](https://badge.fury.io/js/messenger-body.svg)](https://npmjs.org/package/messenger-body) [![Build Status](https://travis-ci.org/AndreasPizsa/messenger-body.svg?branch=master)](https://travis-ci.org/AndreasPizsa/messenger-body)

> Solid, reliable, extensible, framework agnostic body parser and processor for Facebook Messenger bots.

`messenger-body` is a solid, reliable, extensible body parser and processor for Facebook Messenger bots. `messenger-body` parses a Facebook Messenger HTTP body, normalizes each message and executes a handler function for each message.

### Key Features
+ **Solid.** 100% test coverage.
+ **Extensible.** Augment messages with existing and custom plugins.
+ **Framework Agnostic.** Works with Express, Koa, Restify and every other HTTP framework.

> This module is intended for developers who implement framework or server
> specific modules _on top_ of `messenger-body`.
>
> If you are looking to use `messenger-body` with Express or Restify, please
> see `express-messenger-body`.


## Installation

```sh
$ npm install --save messenger-body
```

## Usage

```js
const app = require('express')()
const MessengerEventLoop = require('messenger-body')
app.use(function(req, res) {

})

function handleMessage(message) {
  ...
}
```

### Implementing your Message Handler function

`messenger-body` calls your Message Handler function for each incoming message it receives.

express-event-loop creates it
#### Postback message
```javascript
{
  topic: 'postback.SHOW_FLIGHTS'
  data:  <parsed JSON payload>
}
```

#### quick_reply message
```javascript
{
  topic: 'quick_reply.BOOK_FLIGHT'
  data:  <parsed JSON payload>
}
```

#### Text message
```javascript
{
  topic: 'text'
  data:  'Hello, World!'
}
```

Use cases for plugins
+ Load the user’s profile data from facebook
+ Store user data in your own database

## Features

### Plugins
### JSON payloads for `postback` and `quick_reply`
### 100% Test Coverage
### Framework Agnostic



## Supported Events

| Webhook Event                     | Description                               |
|-------------------------------------------------------------------------------|
| `messages` ✓                        | Subscribes to [Message Received events](https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received)     |
| `message_deliveries`                | Subscribes to Message Delivered events    |
| `message_reads`                     | Subscribes to Message Read events         |
| `message_echoes`                    | Subscribes to Message Echo events         |
| `messaging_postbacks` ✓             | Subscribes to Postback Received events    |
| `messaging_optins` ✓                | Subscribes to Plugin Opt-in events        |
| `messaging_referrals` ✓             | Subscribes to Referral events             |
| `messaging_checkout_updates` (BETA) | Subscribes to Checkout Update events      |
| `messaging_payments` (BETA)         | Subscribes to Payment events              |
| `messaging_account_linking`         | Subscribes to Account Linking events      |
| `messaging_policy_enforcement`      | Subscribes to Policy Enforcement events   |


## License

MIT © [Andreas Pizsa](https://github.com/AndreasPizsa)
