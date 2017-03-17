# koa-sequelize-resource


RESTful API based on Sequelize and support ES2015.

## Installation

```
npm install koa-sequelize-resource -S
```

## Usage

```
import Koa from 'koa'
import Router from 'koa-sequelize-resource'
import models from './models/'

const app = new Koa()
const router = Router(models)

router
  .crud('/user', (resources) => resources.User)
  .crud('user/:uid/posts', (resources) => resources.User.hasOne('Posts', 'uid'))
  // or 
  .define('user/:uid/posts', (resources) => ({
    index: resources.User.hasOne('Posts', 'uid').index(),
    create: resources.User.hasOne('Posts', 'uid').create(),
  }))
  .define('user/:uid/posts/:id', (resources) => ({
    update: resources.User.hasOne('Posts', 'uid').update(),
    destroy: resources.User.hasOne('Posts', 'uid').destroy(),
  }))
    
app
  .use(async (ctx, next) => {
    await router.routes()(ctx, next)
  })

const server = http.createServer(app.callback())
app.listen(3000)

```

## Basic request

### Pagination

* Request head:
```
content-range: 'items 10-30/20'
```
* Response:

```
content-range: 'items 10-25/20'
```
* Sometimes, we do not wish calculate the records count:
```
router.define('orders', resources => resources.orders.index({ disableCount: true })
```


### Order by

* Request: 
```
/users?orderby=-username
/users?orderby=email
```
* Response:
```
[
    { username: 'Bill', email: 'bill@who.com' },
    { username: 'Anna', email: 'anna@who.com' },
]
[
    { username: 'Anna', email: 'anna@who.com' },
    { username: 'Bill', email: 'bill@who.com' },
]
```
## Middlewares 

```
router
  .crud('/user', someMiddlewares, resources => resources.user)
  .define('/user/:uid/posts', someMiddlewares, resources => ({
    ...
  }))
```


## Running Test



```
npm test
```
