'use strict'
// Todo: Clean up test

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const split = require('split2')
const request = require('supertest')

const logger = require('./')

chai.use(dirtyChai)

const expect = chai.expect

const setup = function (log) {
  const app = require('express')()

  app
    .use(log.reqResLogger())
    .get('/error', (req, res, next) => {
      const error = new Error('err')
      error.status = 400
      next(error)
    })
    .get('/error500', (req, res, next) => {
      const error = new Error('err')
      next(error)
    })
    .get('/', (req, res, next) => {
      return res.status(200).json({ a: 4 })
    })
    .use(log.errorLogger())
    .get('/attach', (req, res, next) => {
      req.log.info('attach')
      return res.status(200).send()
    })
    .use((err, req, res, next) => {
      return res.status(400).json({
        err: {
          msg: err.message
        }
      })
    })
  return app
}

describe('Logger', () => {
  it('should be a function', () => {
    return expect(logger).to.be.a('Function')
  })
  it('should fail if servicename is not provided', () => {
    return expect(_ => logger({})).to.throw('serviceName is required')
  })

  describe('Disable logs', () => {
    const dest = split(JSON.parse)
    let server, jsonlog

    before(() => {
      const log = require('./logger')({
        serviceName: 'test',
        destination: dest,
        enabled: false
      })
      server = setup(log)

      dest.on('data', data => {
        jsonlog = data
      })

      return request(server)
        .get('/')
        .expect(200)
    })
    it('should not log anything', () => {
      return expect(jsonlog).to.not.exist()
    })
  })

  describe('Log Request middlewware', () => {
    const dest = split(JSON.parse)
    let server
    const jsonlog = []

    before(() => {
      const log = require('./logger')({
        serviceName: 'test',
        destination: dest
      })
      server = setup(log)

      dest.on('data', data => {
        jsonlog.push(data)
      })

      return request(server).get('/')
    })

    it('should provide all required details in logs', () => {
      return expect(jsonlog[0]).to.have.all.keys([
        'severity',
        'name',
        'timestamp',
        'pid',
        'hostname',
        'type',
        'httpRequest',
        'v'
      ])
    })

    it('should have the right severity', () => {
      return expect(jsonlog[0].severity).to.be.equal(200)
    })
    it('timestamp should be a string', () => {
      return expect(jsonlog[0].timestamp).to.be.a('String')
    })
    it('timestamp should be a recent date')
    it('hostname should be a string', () => {
      return expect(jsonlog[0].hostname).to.be.a('String')
    })

    it('should contain "type" as a "reqLogger"', () => {
      return expect(jsonlog[0].type).to.be.eql('reqLogger')
    })
    it('should have the right serviceName', () => {
      return expect(jsonlog[0].name).to.be.equal('test')
    })
    describe('HttpRequest', () => {
      it('should contain all required values from Stackdriver "httpRequest" proto', () => {
        return expect(jsonlog[0].httpRequest).to.have.all.keys(
          'requestMethod',
          'requestUrl',
          'remoteIp',
          'protocol',
          'requestId',
          'serverIp',
          'userAgent',
          'latency',
          'responseSize',
          'status',
          'headers'
        )
      })
      it('should have the right request url', () => {
        return expect(jsonlog[0].httpRequest.requestUrl).to.be.equal('/')
      })
      it('should have the right requestMethod', () => {
        return expect(jsonlog[0].httpRequest.requestMethod).to.be.equal('GET')
      })
      it('report ip should be string', () => {
        return expect(jsonlog[0].httpRequest.remoteIp).to.be.a('String')
      })
      it('should use the right protocol', () => {
        return expect(jsonlog[0].httpRequest.protocol).to.be.equal('http')
      })
      it('should have the right usergent', () => {
        return expect(jsonlog[0].httpRequest.userAgent).to.be.match(
          /node-superagent/
        )
      })
      it('should have latency in nanoseconds', () => {
        return expect(jsonlog[0].httpRequest.latency.nanos).to.exist()
      })

      it('should have latency in seconds', () => {
        return expect(jsonlog[0].httpRequest.latency.seconds).to.exist()
      })

      it('should have string "responseSize"', () => {
        return expect(jsonlog[0].httpRequest.responseSize).to.be.a('String')
      })
      it('should have the right status ', () => {
        return expect(jsonlog[0].httpRequest.status).to.be.equal(200)
      })
      it('should contain the right headers', () => {
        return expect(jsonlog[0].httpRequest.headers).to.have.all.keys(
          'host',
          'accept-encoding',
          'user-agent',
          'connection'
        )
      })
      it('should attach log to req', async () => {
        await request(server).get('/attach')
        expect(jsonlog[1].msg).to.equal('attach')
      })
    })
  })
  describe('Error logger middleware', () => {
    let server
    const jsonlogs = []

    before(() => {
      const dest = split(JSON.parse)
      dest.on('data', data => {
        jsonlogs.push(data)
      })

      const log = require('./logger')({
        serviceName: 'test',
        destination: dest
      })
      server = setup(log)

      return request(server).get('/error')
    })
    it('should provide all required details in logs', () => {
      const errorlogs = jsonlogs[0]
      return expect(errorlogs).to.have.all.keys(
        'type',
        'pid',
        'timestamp',
        'name',
        'severity',
        'context',
        'message',
        'hostname',
        'v'
      )
    })
    it('should have the right type', () => {
      return expect(jsonlogs[0].type).to.be.eql('errorLogger')
    })
    it('should have service name', () => {
      return expect(jsonlogs[0].name).to.be.equal('test')
    })
    it('should have severity as "500"', () => {
      return expect(jsonlogs[0].severity).to.be.equal(500)
    })
    it('should have a message which should be a string ', () => {
      return expect(jsonlogs[0].message).to.be.a('String')
    })
    describe('Context', () => {
      let context

      before(() => {
        return (context = jsonlogs[0].context)
      })
      it('should have "httpRequest.method"', () => {
        return expect(context.httpRequest.method).to.be.equal('GET')
      })
      it('should have "httpRequest.url"', () => {
        return expect(context.httpRequest.url).to.be.equal('/error')
      })
      it('should a string "httpRequest.requestId"', () => {
        return expect(context.httpRequest.requestId).to.be.a('String')
      })
      it('should have the right status code for  "httpRequest.responseStatusCode"', () => {
        return expect(context.httpRequest.responseStatusCode).to.be.equal(400)
      })
      it('should have the right status code for  "httpRequest.responseSatusCode" when the error  has no associated status', async () => {
        await request(server).get('/error500')

        const context = jsonlogs[2].context
        return expect(context.httpRequest.responseStatusCode).to.be.equal(500)
      })
    })
  })
})
