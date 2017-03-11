# koa-sequelize-resource

[![Travis branch][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

RESTful API based on Sequelize and support ES2015.

## Installation

```
npm install koa-sequelize-resource
```

## Usage

```
import Koa from 'koa'
import Router from 'koa-router'
import Resource from 'koa-sequelize-resource'
import { User } from './models/user'

const app = new Koa()
const router = Router()
const user = new Resource(models.User)
    
router.get('/user', user.readAll())
router.get('/user/:id', user.readOne())
router.post('/user', user.create())
router.patch('/user/:id', user.update())
router.delete('/user/:id', user.destroy())

app.use(async (ctx, next) => {
    await router.routes()(ctx, next)
  })

const server = http.createServer(app.callback())
app.listen(3000)

```
