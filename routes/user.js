const router = require('koa-router')()
const userController = require('../controllers/userController.js')

//登录
router.get('/login',userController.login)
//注册
router.get('/register',userController.register)
//登录操作
router.post('/dologin',userController.doLogin)
//注册操作
router.post('/doregister',userController.doRegister)
//激活注册操作
router.get('/active/:activeToken',userController.registerActive)
module.exports = router 