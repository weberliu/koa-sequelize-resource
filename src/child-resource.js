import Resource from './resource'

export default class ChildResource extends Resource {
  constructor(parent, alias, model, options) {
    super(model, options)
    
    this.alias = alias
    this.parent = new Resource(parent)
  }

  index (include) {
    return [
      this.parent.getEntity({model: this.model, as: this.alias}),
      super.index(include)
    ]
  }

  show() {
    return [
      this.parent.getEntity({model: this.model, as: this.alias}),

      async (ctx, next) => {
        if (ctx.state.instance) {
          ctx.state.parent = ctx.state.instance
          ctx.state.instance = ctx.state.instance[this.alias]
          
          await next()
          
          ctx.status = 200
          ctx.body = ctx.state.instance
        } else {

          await next()

          ctx.status = 204
        }
      }
    ]
  }

  create() {
    return [
      this.parent.getEntity({model: this.model, as: this.alias}),

      async (ctx, next) => {
        await next() 
      }      
    ]
  }
}