'use strict'

const routes = require('@npm/spife/routing')

module.exports = routes`
  GET / index
`(require('./views'))
