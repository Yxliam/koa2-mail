const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session-minimal')
const response_format = require('./middlewares/response_format')

const index = require('./routes/index')
const user = require('./routes/user')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 应用处理 session 的中间件
app.use(session({
  key: 'yxl',          // cookie 中存储 session-id 时的键名, 默认为 koa:sess
  cookie: {                   // 与 cookie 相关的配置
      path: '/',              // 写 cookie 所在的路径
      maxAge: 1000*60,      // cookie 有效时长
      httpOnly: true,         // 是否只用于 http 请求中获取
      overwrite: false        // 是否允许重写
  }
}))


app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  map:{html:'ejs'}
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
//格式化响应结果中间件
app.use(response_format)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
