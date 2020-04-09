'use strict'
const ip = require('ip')

const serializers = {
  req (req) {
    return {
      requestUrl: req.url,
      requestMethod: req.method,
      remoteIp: req.remoteAddress,
      protocol: req.raw.protocol,
      requestId: req.id,
      serverIp: ip.address(),
      referer: req.headers && req.headers.referer,
      userAgent: req.headers && req.headers['user-agent'],
      latency: {
        seconds: Math.floor(req.raw.latency / 1e3),
        nanos: Math.floor((req.raw.latency % 1e3) * 1e6)
      },
      requestSize: req.headers && req.headers['content-length'],
      responseSize: req.raw['content-length'],
      status: req.raw.statusCode,
      headers: req.headers
    }
  }
}

module.exports = function serailizers () {
  return serializers
}
