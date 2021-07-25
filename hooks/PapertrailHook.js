'use strict';

const Transport = require('winston-transport');
const os = require('os');
const winston = require('winston');
//require('winston-syslog');

module.exports = class PapertrailHook extends Transport {
  constructor(opts) {
    super(opts);

    opts = opts || {};

    this.name = opts.name || 'PapertrailWebhook';
    this.level = opts.level || undefined;
    this.host = opts.host;
    this.port = opts.port;
    this.formatter = opts.formatter || undefined;

  }

  log(info, callback) {
    let payload = {

    }

    let layout = this.formatter(info);
    payload.text = layout && layout.text;

    if (!payload.text) {
      // if nothing passed, don't log
      return callback();
    }



const papertrail = new winston.transports.Syslog({
  host: this.host,
  port: this.port,
  protocol: 'tls4',
  localhost: os.hostname(),
  eol: '\n',
});

const logger = winston.createLogger({
  format: winston.format.simple(),
  levels: winston.config.syslog.levels,
  transports: [papertrail],
});

logger.info(typeof payload.text == 'string' ? payload.text : JSON.stringify(payload.text, null, "\n"));
  }
}
