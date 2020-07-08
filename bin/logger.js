var moment = require('moment');
var winston = require('winston');


var config = winston.config;
winston.emitErrs = true;
var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      timestamp() {
        return moment().format('DD/MM/YYYY HH:mm:ss');
      },
      level: 'silly', // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
      filename: './logs/logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      //maxFiles: 5,
      colorize: false,
      formatter: function (options) {
        
        return options.timestamp() + ' ' +
          options.level.toUpperCase() + ': ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      }
    }),
    new winston.transports.Console({
      timestamp() {
        return moment().format('DD/MM/YYYY HH:mm:ss');
      },
      level: 'silly', // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
      handleExceptions: true,
      json: false,
      colorize: true,
      formatter: function (options) {

        return options.timestamp() + ' ' +
          config.colorize(options.level, options.level.toUpperCase()) + ': ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      }
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function (message, encoding) {
    console.log(message);
    logger.info(message.replace(/(\r\n|\n|\r)/gm, ""));
  }
};

module.exports = logger;