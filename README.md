[![NPM version](https://badge.fury.io/js/messenger-core.svg)](https://npmjs.org/package/messenger-core)
[![Build Status](https://travis-ci.org/AndreasPizsa/messenger-core.svg?branch=master)](https://travis-ci.org/AndreasPizsa/messenger-core)

**`messenger-core`**

> Write-once, run anywhere Messenger bots.

## Features

[![Greenkeeper badge](https://badges.greenkeeper.io/AndreasPizsa/messenger-core.svg)](https://greenkeeper.io/)
+ **Universal.** Build your bot once, run it anywhere
+ **Framework Agnostic.** Works with Micro, Express, Koa, Restify, Hapi and every other HTTP framework
+ **Extensible.** Enhance your bot with re-usable plugins, or share your own
+ **Solid.** 100% test coverage.

## Implementations

| Framework     | Package                  |
|---------------|--------------------------|
| **Express**   | `express-messenger` WIP  |
| **Micro**     | `micro-messenger`   WIP  |
| **Koa**       | `koa-messenger`     TBD  |
| **Restify**   | `express-messenger` TBD  |
| **HAPI**      | `hapi-messenger`    TBD  |

## Architecture

```
+--------+--------+--------+--------+--------+
| plugin | plugin | plugin | plugin | plugin |
+--------+--------+--------+--------+--------+
|               messenger-core               |
+--------------------------------------------+
----------- ----------- ----------- ----------
  express      micro        koa        hapi
----------- ----------- ----------- ----------
```

## Plugins

Plugins add useful features and functionality to your bot. They are the central building blocks that make your bot a bot.

+ `messenger-req-log` use `req.log` for logging
+ `messenger-page-token` get the receiving page’s page access token
+ `messenger-user-profile` get sender’s user profile
+ `messenger-send` add `send` methods
+ `messenger-intl` i18n support

-----
> ** Documentation is Work in Progress **

## Installation

```sh
$ npm install --save messenger-core
```

## Usage

```js
const app = require('express')()
const messenger = require('messenger-core')


```

### Implementing your Message Handler function

`messenger-core` calls your Message Handler function for each incoming message it receives.

express-event-loop creates it

# Message Types

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
