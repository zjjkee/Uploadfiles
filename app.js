var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* multer配置*/
var multer = require('multer');

var storage = multer.diskStorage({
    //设置图片上传后存放的路径(默认放在系统临时文件夹中)
    destination: function(req,file,cb){
        var newdir=`./public/photos/${req.body.mn}`;
        if(!fs.existsSync(newdir)){
            fs.mkdirSync(newdir); 
        }
        cb(null,newdir);

    },
    //设置图片上传后图片的名称(默认随机给一个名字)
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});
var upload = multer({
    storage:storage
});

/* 引入自定义模块：photos路由文件 */

var photos = require('./routes/photos');

/* 全局环境配置 */

app.set('port', process.env.PORT || 3000);

//设置静态文件托管目录
app.use(express.static(path.join(__dirname, 'public')));

//设置模版
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.set('photos', path.join(__dirname, 'public','photos'));
//设置网页favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/* 路由配置 */

//首页/图片上传页面
// app.get('/', photos.list);
app.get('/',  photos.upload_form);
app.get('/upload', photos.upload_form);
//响应图片上传
app.post('/upload', upload.array('file',10), photos.submit(app.get('photos')));

//搜索marking number号面页
app.get('/search', photos.search_form);
//响应nm号页
app.post('/search',photos.search_result(app.get(photos)));


//list页面，列出所有mn
app.get('/list',photos.list);
//响应list页面，print
app.post('/list',photos.print)


//监听端口配置
app.listen(app.get('port'), function(){
    console.log('Express server listening on port: ' + app.get('port'));
});

