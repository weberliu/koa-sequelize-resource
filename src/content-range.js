import contentRange from 'content-range'
import debug from 'debug'
import _ from 'lodash'

const log = debug('koa-sequelize-resource')

export default class pagination {
  constructor(header) {
    this.range = contentRange.parse(header)
  }
  
  parse () {
    const range = this.range

    if (_.isEmpty(range)) return
    
    log('Content Range', range)

    return { offset: range.first, limit: range.length, }
  }

  format (length, total) {
    const range = this.range

    if (_.isEmpty(range)) return

    return contentRange.format({
      unit: range.unit,
      first: range.first,
      limit: range.first + (length || 0),
      length: total || length || 0,
    })
  }
} 