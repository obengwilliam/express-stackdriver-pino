'use strict'

const pino = require('pino')
const generateRequestId = require('uuid/v1')
const customLevels = require('./stackdriver-levels')()
const customSerializers = require('./serializers')()
const pinoSerializers = pino.stdSerializers

const defaultPinoConfig = {
  serializers: {
    httpRequest: pinoSerializers.wrapRequestSerializer(customSerializers.req),
    context: customSerializers.errorContext
  },
  customLevels,
  timestamp: function () {
    const date = new Date()
    return `,"timestamp": "${date.toISOString()}"`
  },
  redact: ['token', 'access_token', 'password', 'secret'],
  changeLevelName: 'severity',
  useOnlyCustomLevels: true
}

function onRequestFinish (req, res, log) {
  return function finish (data) {
    const latency = Date.now() - res.startTime
    res.latency = latency
    req = Object.assign(req, {
      latency: res.latency,
      statusCode: res.statusCode,
      'content-length': res.get('content-length') || 0
    })
    req.log.info({ httpRequest: req })
  }
}

module.exports = function logger ({
  serviceName,
  enabled = true,
  destination
}) {
  if (!serviceName) throw new Error('serviceName is required')

  const config = Object.assign({}, defaultPinoConfig, {
    name: serviceName,
    enabled
  })
  const log = pino(config, destination)

  /**
   * Log req and res based on a specific log format
   * @return Express midlleware.
   */
  log.reqResLogger = () => {
    return function (req, res, next) {
      req.id = req.id || generateRequestId()
      const reqLogger = log.child({ type: 'reqLogger' })

      res.startTime = Date.now()
      req.log = reqLogger

      res.once('finish', onRequestFinish(req, res, reqLogger))
      res.once('error', onRequestFinish(req, res, reqLogger))
      if (next) next()
    }
  }

  log.errorLogger = () => {
    return function errorLogger (err, req, res, next) {
      const errorlog = log.child({ type: 'errorLogger' })
      errorlog.error({
        message: err.stack,
        context: {
          httpRequest: {
            method: req.method,
            url: req.url,
            remoteIp: req.remoteAddress,
            responseStatusCode: err.status || 500,
            requestId: req.id
          }
        }
      })
      if (next) next(err)
    }
  }
  return log
}
