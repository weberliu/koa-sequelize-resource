import contentRange from 'content-range'
import debug from 'debug'
import _ from 'lodash'

const log = debug('koa-sequelize-resource')

export default class pagination {
  constructor(ctx) {
    this.ctx = ctx
    this.range = contentRange.parse(ctx.header['content-range'])
  }
  
  parse () {
    const range = this.range

    if (_.isEmpty(range)) return
    
    log('Content Range', range)

    return { offset: range.first, limit: range.length, }
  }

  format () {
    const range = this.range

    if (_.isEmpty(range)) return

    return contentRange.format({
      unit: range.unit,
      first: range.first,
      limit: this.ctx.state.instances.length || 0,
      length: this.ctx.state.instanceCount || this.ctx.state.instances.length || 0,
    })
  }
} 