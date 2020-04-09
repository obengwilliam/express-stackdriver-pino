'use strict'
module.exports = {
  deleteAllRequireCache: _ =>
    Object.keys(require.cache).forEach(key => delete require.cache[key]),
  deleteRequireCache: key => delete require.cache[key]
}
