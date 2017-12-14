const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  if(!ctx.session.user){
    ctx.redirect('/login')
  }
  await ctx.render('index', {
    title: '首页',
    router:'index',
    user: ctx.session.user
  })
})




module.exports = router
