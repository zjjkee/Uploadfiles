var Photo = require('../models/Photo');
var path = require('path');

// GET '/' 首页
exports.list = function(req,res){
    //查找数据库中的所有图片数据，并渲染首页index.ejs
    Photo.find(function(err,photos){
        if(err){
            return next(err);
        }
        res.render('index',{
            title: 'Photos Storage',
            photos: photos
        });
    });
};

//GET '/upload' 图片上传页
exports.form = function(req,res){
    res.render('upload',{
        title: 'Photo Upload'
    });
};

//POST '/upload' 响应图片上传
exports.submit = function(dir){

    return function(req,res,next){
        var imgs = req.files;//获取图片上传后multer封装好的对象
        // var name =req.body.name || img.originalname;
        
        console.log('this is req.files:',imgs);
        console.log("this is req.body:",req.body);
        //把上传的图片信息保存到数据库
        Photo.create({
            name:req.body.name,
            phone:req.body.phone,
            // company:String,
            mn:req.body.mn,
            cn:req.body.cn,
            path:imgs[0].destination
        }, function(err){
            if(err){
                res.send('<h1>This Mark Number/Container Number has already been uploaded!</h1><br><p>Please try another one!</p><br><a href="http://localhost:3000/upload">Continue Uploading</a>')
                return next(err);
            }else{
                res.send('Upload Successfully!<br><a href="localhost:3000/upload">Continue Uploading</a>');
            }
        });
        };
        
};

//GET /photo/:id/view 点击图片，查看单张图片
exports.view = function(dir){

    return function(req,res,next){
        //通过id查找所需图片
        var id = req.params.id;
        Photo.findById(id,function(err,photo){
            if(err){
                return next(err);
            }

            var options = {
                root:dir
            }
            res.sendFile(photo.path,options);
        });
    };
};

//GET /photo/:id/download 下载图片
exports.download = function(dir){

    return function(req,res,next){
        //通过id查找所需图片
        var id = req.params.id;
        Photo.findById(id,function(err,photo){
            if(err){
                return next(err);
            }
            var img = path.join(dir, photo.path);
            res.download(img);
        });
    };
};

