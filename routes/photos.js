var Photo = require('../models/Photo');
var path = require('path');
var fs = require("fs");
var sd=require("silly-datetime");

// GET list页
exports.list = function(req,res){
    //查找数据库中的所有图片数据，并渲染首页index.ejs
    Photo.find({},function(err,dbitems){
        if(err){
            return next(err);
    } 
    var l=[];
    for(dbitem of dbitems){
        l.push(dbitem._doc);
    }
    // console.log(dbitems)
    res.render('list',{
        doc_list:l,
    })
    });
};
//POST 响应list页面，生成print页面
exports.print = function(req,res){
    //查找数据库中的所有图片数据，并渲染首页index.ejs
    var mnlist= req.body.mn;//[ 'as123', 'fw214', 'as214', 'as241' ]
    var doc_list=[]
    console.log("this is mnlist:",mnlist);
    
    Photo.find({mn:{$in:mnlist}},function(err,dbitems){
        if(err){
            return next(err);
    }      
    // console.log("this is dbitem._doc:",dbitems);
    for(dbitem of dbitems){
        let l=dbitem._doc;
        doc_list.push(l);
    }
    console.log(doc_list);   //[{mn:as123,cn:asdaf,..},{},{}......] !!!!!!!!!!
    var path_list=[];
    for(dbitem of dbitems){
        let l=dbitem._doc.path;
        path_list.push(l);
    }
    console.log('THis is path_list:',path_list);//['./public/photos/as123',...]
    var filename_list=[];
 
    // path_list.forEach(folder) => {
    //     fs.readdir(`${unzippedPath}/${folder}/`, (err, files) => {
    //         // console.log(files);
    //         filename_list.push(files);
    //         console.log(filename_list);
    // });

    unzippedPath='./public/photos/';
    for(let i of path_list){
        var filename = fs.readdirSync(i);
        filename_list.push(filename);
   
    }
    console.log(filename_list);

    res.render('list_print',{   
        doc_list:doc_list,//[{mn:as123,cn:asdaf,..},{},{}......]
        filename_list:filename_list,     // [['file1','file2',..],[],[]....]
        path_list:path_list
    });   

    });

};

//GET '/upload' 图片上传页
exports.upload_form = function(req,res){
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
        var t = sd.format(Date.now());
        // var reg = new RegExp("/public");
        // var files_path=imgs[0].destination.replace(reg,"");
        var files_path=imgs[0].destination
        console.log(files_path);
        //把上传的图片信息保存到数据库
        Photo.create({
            name:req.body.name,
            phone:req.body.phone,
            // company:String,
            mn:req.body.mn,
            cn:req.body.cn,
            path:files_path,
            date:t
        }, function(err){
            if(err){
                res.send('<h1>This Mark Number/Container Number has already been uploaded!</h1><br><p>Please try another one!</p><br><a href="/">Continue Uploading</a>')
                return next(err);
            }else{
                res.send('Upload Successfully!<br><a href="/">Continue Uploading</a>');
            }
        });
        };
        
};

//GET   search搜索mn

exports.search_form = function(req,res){
    res.render('search',{
        title: 'Search '
    });
};

//POST   响应搜索mn
exports.search_result = function(dir){
    return function(req,res){
        req_mn=req.body.mn;//单个值：ab123
        Photo.findOne({mn:req_mn},function(err,dbitem){
            if(err){
                return next(err);
        }      
            if(dbitem!=undefined){
                fold_path=dbitem._doc.path;//./public/photos/123
                fs.readdir(fold_path,'utf-8',function(err,data){
                    if(err){
                        return next(err)} 
                    // console.log("data:",data);
                    // console.log('this is data[0]',fold_path);
                    // console.log(dbitem[0]._doc)
                    reg = new RegExp("/public");
                    fold_path=fold_path.replace(reg,"");//./photos/123
                    res.render('search_result',{
                        title:`Mark Number:${req.params.mn}`,
                        cn:dbitem._doc.cn,
                        mn:dbitem._doc.mn,
                        foldpath: fold_path,   //./photos/123
                        filename_list:data    //[ '微信图片_20220707122716.jpg', '微信图片_20220708190925.jpg' ]
                    });   
    
                })
            }else{
                res.send("This Mark Number Is Not Found!! Please try another one")
            
            }          
        });
    };
};

