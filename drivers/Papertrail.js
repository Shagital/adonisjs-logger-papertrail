'use strict'

const _ = require('lodash')
const Winston = require('winston')
const PapertrailHook = require('../hooks/PapertrailHook');


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
  setConfig(config) {
    this.config = config

    /**
     * Creating new instance of winston with Papertrail transport
     */

    this.logger = Winston.createLogger({
      level: this.config.level,
      transports: [
        new PapertrailHook({
          host: this.config.host,
          port: this.config.port,
          name: this.config.name,
          formatter: (info) => {
            let { level, message, request = {} } = info

            delete info.message
            delete info.request
            delete info.level


            let payload = { text: null }

            let text = '';

            if (typeof message === 'object') {
              // if an exception was passed
              text = level.toUpperCase() + ' [' + process.env.NODE_ENV + ']: ' + `${message.name ? ` ${message.name} - ` : ' '}` + message.message
              if (message.stack) text += '\n>```' + message.stack + '```'

            } else {
              // if a string was passed
              let messageString = message.toString();

              if (messageString == 'serving app on http://%s:%s') {
                messageString = this.formatString(messageString, ['%s', '%s'], [process.env.HOST, process.env.PORT])
              }

              // if user doesn't want app start to be logged
              if (!this.config.appStart) {
                // log to console so user knows app has started
                console.log(`${level.toUpperCase()} [${process.env.NODE_ENV}] : ${messageString}`);

                // fail quietly
                return null;
              }

              text = `${level.toUpperCase()} [${process.env.NODE_ENV}] : ${messageString}`
            }
            payload.text = text;
            return payload
          },

        })
      ],
    })

    /**
     * Updating winston levels with syslog standard levels.
     */
    this.logger.setLevels(this.levels)
  }

  formatString(string, search, replacement) {
    for (let i in search) {
      string = string.replace(search[i], replacement[i])
    }

    return string;
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  /**
   * A list of available log levels.
   *
   * @attribute levels
   *
   * @return {Object}
   */
  get levels() {
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
  get level() {
    return this.logger.transports[this.config.name].level
  }

  /**
   * Update driver log level at runtime
   *
   * @param  {String} level
   *
   * @return {void}
   */
  set level(level) {
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
  log(level, msg, ...meta) {
    const levelName = _.findKey(this.levels, (num) => {
      return num === level
    })

    this.logger.log(levelName, msg, ...meta)

  }
}

module.exports = Papertrail
