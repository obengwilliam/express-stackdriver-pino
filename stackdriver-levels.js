'use strict'

const stackDriverLogLevels = {
  trace: 100,
  debug: 100,
  info: 200,
  warn: 400,
  error: 500,
  fatal: 600
}

module.exports = function levels () {
  return stackDriverLogLevels
}
