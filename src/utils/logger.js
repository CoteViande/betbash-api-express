import winston from 'winston'
winston.emitErrs = true

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      name: 'info logs',
      level: 'info',
      filename: './logs/logs-info.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.File({
      name: 'warning level',
      level: 'warning',
      filename: './logs/logs-warning.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: true,
    })
  ],
  exitOnError: false,
})

export default logger