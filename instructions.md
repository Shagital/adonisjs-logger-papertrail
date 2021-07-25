## Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  '@shagital/adonisjs-logger-papertrail/providers/PapertrailProvider'
]
```

Add new configuration inside `logger` module in `config/app.js`:
```js
papertrail: {
    name: Env.get('APP_NAME', 'adonis-app'),
    driver: 'papertrail',
    host: Env.get('PAPERTRAIL_HOST'),
    port: Env.get('PAPERTRAIL_PORT'),
    level: 'info',
    appStart : false, // whether to create log when app is starting
}
```

That's it! Now you can use Logger that will send data to Papetrail.

```js
const Logger = use('Logger')

Logger.info('Test message')

```

## Env variables

`papertrail` driver relies on the following Env variables:
- `PAPERTRAIL_HOST`
- `PAPERTRAIL_PORT`
