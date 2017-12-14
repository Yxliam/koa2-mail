const User = require('../model/userModel');
const mailer = require('../lib/mailer')

class UserController{
    static async login (ctx,next){
        await ctx.render('login', {
            title: '登录',
            router:'login',
          })
    }
    
    static async register (ctx,next){
        await ctx.render('register', {
            title: '注册',
            router:'register',
          })
    }
    static async doLogin (ctx,next){
        const { username,password } = ctx.request.body
        let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!username || !password){
            ctx.jsonReturn({
                code:1,
                msg:'邮箱或者密码为空'
            })
        }
        if(!myreg.test(username)) {
            ctx.jsonReturn({
                code:1,
                msg:'邮箱错误'
            })
         }
         let  user = await User.findOne({
             username:username,
             password:password,
             active:true,
         })
         if(!user){
            ctx.jsonReturn({
                code:1,
                msg:'登录失败，邮箱、密码错误或者该邮箱没有激活'
            })
         }else{
            ctx.session.user = username
            ctx.jsonReturn({
                code:2,
                msg:'登录成功'
            }) 
         }
    }
    static async doRegister(ctx,next){
        const { username,password } = ctx.request.body
        let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!username || !password){
            ctx.jsonReturn({
                code:1,
                msg:'邮箱或者密码为空'
            })
        }
        if(!myreg.test(username)) {
            ctx.jsonReturn({
                code:1,
                msg:'邮箱错误'
            })
         }
        
        
            // 设置过期时间为24小时
            let activeExpires = Date.now() + 24 * 3600 * 1000;
            let date = Date.now();
             var link = 'http://127.0.0.1:4000/active/'
                           + date;
                  
                // 发送激活邮件
                mailer({
                    to: username,
                    subject: '欢迎注册',
                    html: '请点击 <a href="' + link + '">此处</a> 激活。'
                });
                let user = new User({
                    username:username,
                    password:password,
                    activeToken:date,
                    activeExpires:activeExpires
                })

                // 保存用户对象
               await user.save(function(err, user){
                    if(err){
                        ctx.jsonReturn({
                            code:1,
                            msg:err
                        })
                    }
                    ctx.jsonReturn({
                        code:2,
                        msg:'已发送邮件至' + user.username + '，请在24小时内按照邮件提示激活。'
                    })
                });
    }
    static async registerActive(ctx,next){
        // 找到激活码对应的用户
      let userData =  await User.findOne({
            activeToken: ctx.params.activeToken,
            // 过期时间 > 当前时间
            activeExpires: {$gt: Date.now()}
        });
        if(!userData){
             return ctx.render('message', {
                            title: '激活失败',
                            content: '激活失败，请前往 <a href="/register">注册</a>'
                        })
        }else{
             let updateRes = await User.update({'activeToken':ctx.params.activeToken},{'active':true});
            if(!updateRes){
                return ctx.render('message', {
                    title: '激活失败',
                    content: userData.username + '激活失败，请前往 <a href="/register">注册</a>'
                })
            }else{
                return  ctx.render('message', {
                    title: '激活成功',
                    content: userData.username + '已成功激活，请前往 <a href="/login">登录</a>'
                })
            }
        }
    }
}

module.exports = UserController;