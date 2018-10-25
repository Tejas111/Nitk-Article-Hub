var express = require('express');
var router = express.Router();
var student = require('../models/userdetail');
var mongoose = require('mongoose');
var users = require('../models/user');
var article = require('../models/article');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage');
});
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/multer', function(req, res, next) {
  res.render('multer');
});


router.get('/all_articles', function(req, res, next) {
  res.render('user/all_articles');
});


router.get('/edit_profile', function(req, res, next) {
  res.render('user/edit_profile');
});
router.get('/uploads',(req,res)=>{
  student.find({_id:req.user._id})
<<<<<<< HEAD
  .then((files)=>{
    console.log(files);
    res.json(files);
    //console.log(files);
  },(err)=>next(err))
  .catch((err)=>next(err));
})

router.get('/pro', function(req, res, next) {
  //var a = toString(req.user._id);
  //var id = mongoose.Types.ObjectId(a);
  student.findById(req.user._id).populate('Index')
  .then((files)=>{
    console.log(files);
    res.json(files);
    //console.log(files);
  },(err)=>next(err))
  .catch((err)=>next(err));
});
=======
  .exec((err,file)=>{
    if (err) throw err;
    else
      res.json(file);
      console.log(file);
  })
});

>>>>>>> 1af34da38ddc14133b11b41af1dc049aa0e8b50a
router.get('/new_article', function(req, res, next) {
  res.render('user/new_article');
});
router.get('/article', function(req, res, next) {
  res.render('search/article');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});
router.get('/myuploads',function(req,res,next){
  article.find({uploaded:req.user._id})
  .then((files)=>{
    console.log(files);
    res.json(files);
    //console.log(files);
  },(err)=>next(err))
  .catch((err)=>next(err));
})


module.exports = router;
