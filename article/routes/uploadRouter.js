var express = require('express');
var uploadRouter = express.Router();
var bodyParser = require('body-parser');
var article = require('../models/article');
var multer = require('multer');
var path = require('path');
//config multer

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name+'.pdf')
    }
}
);

const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(pdf)$/)){
        return cb(new Error('You can upload pdf files!'),false);
    }
    cb(null,true);
};
const upload = multer({storage:storage, fileFilter:imageFileFilter});

uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.get((req,res,next)=>{
    res.render('multer');
})

.post(upload.single('pdf'),(req,res,next)=>{
    req.body.uploaded = req.user._id,
    article.create(req.body)
    .then((article)=>{
        console.log(article);
    },(err) => next(err))
    .catch((err)=>next(err));
    res.json(req.file);
})
module.exports= uploadRouter;