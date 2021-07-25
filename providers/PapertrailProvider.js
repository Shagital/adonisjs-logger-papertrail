'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const Papertrail = require('../drivers/Papertrail')

class PapertrailProvider extends ServiceProvider {
  register () {
    this.app.extend('Adonis/Src/Logger', 'papertrail', () => {
      return new Papertrail()
    })
  }
}

module.exports = PapertrailProvider
