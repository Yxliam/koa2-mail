const mongoose = require('../lib/db'),
      Schema = mongoose.Schema;
//创建一个 userSchema 的模式
var UserSchema = new Schema({
    username: String,
    password: String,
    active: {
        type: Boolean,
        default: false
    },
    activeToken:String,
    activeExpires: Date,
})
// 把模式(UserSchema)挂载User的模型上，以后的实例直接映射到数据库的一个文档
module.exports = mongoose.model('User',UserSchema);