module.exports = async (ctx,next)=>{
    //请求成功
    ctx.jsonReturn  = ({code,msg,data}) =>{
        //1是失败  2是成功    
         code = code ? code : 2;
         data = data ? data : {}
        ctx.body = { code, msg,data };
    };
    //传递给下一个中间件
    await next();
}