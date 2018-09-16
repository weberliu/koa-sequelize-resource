# koa-sequelize-resource


RESTful API based on Sequelize and support ES2015.

## Installation

```
yarn add koa-sequelize-resource -S
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
  .crud('user/:uid/posts', (resources) => resources.User.relations('Posts', 'uid'))
  // or
  .define('/user/:uid/posts', (resources) => ({
    all: resources.User.relations('Posts', 'uid').all(),
    create: resources.User.relations('Posts', 'uid').create(),
  }))
  .define('/user/:uid/posts/:id', (resources) => ({
    update: resources.User.relations('Posts', 'uid').update(),
    destroy: resources.User.relations('Posts', 'uid').destroy(),
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

* Request:
```
&offset=10&limit=10
```
* Response:
```
{
  metadata: {
    pagination: {
      offset: 10,
      limit: 10,
      currentPage: 1,
      pageCount: 3,
      totalCount: 30,
      prevOffset: 0,
      nextOffset: 20
    }
  },
  items: []
}
```
* Sometimes, we do not wish calculate the records count:
```
router.define('orders', resources => resources.orders.index({ disableCount: true })
```


### Order by

* Request:
```
/users?sort=-username
/users?sort=email
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
yarn test
```
