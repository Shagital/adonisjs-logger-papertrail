'use strict'

const _ = require('lodash')
const Winston = require('winston')
const os = require('os')
const Syslog = require('winston-syslog').Syslog

/**
 * Winston console transport driver for @ref('Logger')
 * All the logs will be sent to Papertrail.
 *
 * @class Papertrail
 * @constructor
 */
class Papertrail {
  /**
   * Set config. This method is called by Logger
   * manager by set config based upon the
   * transport in use.
   *
   * @method setConfig
   *
   * @param  {Object}  config
   */
  setConfig (config) {
    this.config = config

    const papertrail = new Syslog({
      host: this.config.host,
      port: this.config.port,
      protocol: 'tls4',
      localhost: os.hostname(),
      eol: '\n'
    })

    /**
     * Creating new instance of winston with Papertrail transport
     */

    this.logger = Winston.createLogger({
      level: this.config.level,
      format: Winston.format.simple(),
      transports: [papertrail],
      levels: this.levels
    })
  }

  /**
   * A list of available log levels.
   *
   * @attribute levels
   *
   * @return {Object}
   */
  get levels () {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    }
  }

  /**
   * Returns the current level for the driver
   *
   * @attribute level
   *
   * @return {String}
   */
  get level () {
    return this.logger.transports[this.config.name].level
  }

  /**
   * Update driver log level at runtime
   *
   * @param  {String} level
   *
   * @return {void}
   */
  set level (level) {
    this.logger.transports[this.config.name].level = level
  }

  /**
   * Log message for a given level
   *
   * @method log
   *
   * @param  {Number}    level
   * @param  {String}    msg
   * @param  {...Spread} meta
   *
   * @return {void}
   */
  log (level, msg, ...meta) {
    const levelName = _.findKey(this.levels, (num) => {
      return num === level
    })

    this.logger.log(levelName, msg, ...meta)
  }
}

module.exports = Papertrail
