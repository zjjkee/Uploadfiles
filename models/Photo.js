var mongoose = require('mongoose');
//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/photo');

//创建模式/原型Schema
var PhotoSchema = new mongoose.Schema({
    name:String,
    phone:Number,
    // company:String,
    mn:{
        type:Number,
        unique:true
    },
    cn:{
        type:Number,
        unique:true
    },
    path:String
});

//创建模型Model
var Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;