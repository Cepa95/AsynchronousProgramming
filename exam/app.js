require('dotenv-safe').config()
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const commentRoutes = require("./route/comment")

const app = new Koa()

app.use(bodyParser())

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(err)
    ctx.status = err.status || 500;
    ctx.body = {
      err,
      message: err.message
    }
  }
})

app.use(require('./route/user').routes())
app.use(commentRoutes.routes())

module.exports = app
