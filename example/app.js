'use strict'
const log = require('../logger')({ name: 'example' })
const app = require('express')()

app.use(log.reqResLogger())
app.use(log.attachLogToReq({ routeName: 'example' }))

app.get('/error', (req, res, next) => {
  if (req) {
    throw new Error('gone wrong')
  }
  return res.status(400).json({ good: 4 })
})
app.get('/', (req, res, next) => {
  return res.status(200).json({ a: 4 })
})

app.use(log.errorLogger())
app.use((err, req, res, next) => {
  return res.status(400).json({
    err: {
      msg: err.message
    }
  })
})

if (module.parents) {
  app.listen(5050, _ => {
    console.log('listening on ', 5050)
  })
}

module.exports = app
