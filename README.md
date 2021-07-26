# Adonis Logger Papertrail <img src="https://papertrailapp.com/favicon.ico" alt="Papertrail icon" width="25px" height="25px">
![npm (scoped)](https://img.shields.io/npm/v/@shagital/adonisjs-logger-papertrail)
![NPM](https://img.shields.io/npm/l/@shagital/adonisjs-logger-papertrail)

Version [for **Adonis v4**]

This service provider adds Papertrail as a driver to [Adonis Logger](https://adonisjs.com/docs/4.1/logger).

This repo is based from https://github.com/pirmax/adonis-logger-rollbar


## Usage
## Installation
- You can install the package via NPM:
`npm install @shagital/adonisjs-logger-papertrail`
- Or with yarn:
`yarn add @shagital/adonisjs-logger-papertrail`
- Or with adonis:
`adonis install @shagital/adonisjs-logger-papertrail`

### Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@shagital/adonisjs-logger-papertrail/providers/PapertrailProvider'
]
```

Add new configuration inside `logger` module in `config/app.js`:
```js
transport: 'papertrail'

papertrail: {
    name: Env.get('APP_NAME', 'adonis-app'),
    driver: 'papertrail',_
    host: Env.get('PAPERTRAIL_HOST'),
    port : Env.get('PAPERTRAIL_PORT'),
    level: 'info',
    appStart : false, // whether to create log when app is starting
    logEnv : false // should send env variables when logging
}
```

That's it! Now you can use Logger that will send data to Rollbar.

```js
const Logger = use('Logger')

Logger.info('Test message')
Logger.info('Test message', {user}) // to log extra details
Logger.transport('papertrail').info('this will log using the papertrail transport') // to specify the transport manually

```

### Env variables
- Papertrail details can be gotten from https://papertrailapp.com/account/destinations
`Papertrail` driver relies on the following Env variables:
- `PAPERTRAIL_HOST`
- `PAPERTRAIL_PORT`


