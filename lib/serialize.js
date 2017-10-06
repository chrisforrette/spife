'use strict'

const XFORM = Symbol.for('knork-template-serializer')

module.exports = {serialize, XFORM}

const seen = new Set()

function serialize (obj) {
  seen.clear()
  return visit(obj)
}

function visit (obj) {
  if (obj) {
    if (typeof obj === 'object') {
      if (seen.has(obj)) {
        throw new TypeError('Cannot serialize circular structure')
      }
      seen.add(obj)
      const result = Array.isArray(obj) ? visitArray(obj) : visitObject(obj)
      return result
    } else {
      return obj
    }
  } else {
    return obj
  }
}

function visitObject (obj) {
  let target = obj[XFORM] ? obj[XFORM](obj) : obj
  for (var key in target) {
    let visited = visit(target[key])
    if (target === obj && visited !== target[key]) {
      target = Object.assign({}, obj)
    }
    target[key] = visited
  }
  return target
}

function visitArray (arr) {
  let target = arr[XFORM] ? arr[XFORM]() : arr
  for (var idx = 0; idx < arr.length; ++idx) {
    let visited = visit(target[idx])
    if (target === arr && visited !== target[idx]) {
      target = arr.slice()
    }
    target[idx] = visited
  }
  return target
}