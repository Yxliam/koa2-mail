var _ = require('lodash');	
var nodemailer = require('nodemailer');

var config = {
    service: 'qq',
    auth: {
        user: 'qq号码',
        pass: '您的qq授权码' //授权码,通过QQ获取

    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: '来自测试网站 <676557432@qq.com>',
    text: 'hello 测试',
};

module.exports = function(mail){
    // 应用默认配置
    mail = _.merge({}, defaultMail, mail);
    
    // 发送邮件
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};