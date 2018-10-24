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

router.get('/user_home', function(req, res, next) {
  res.render('user/user_home');
});

router.get('/all_articles', function(req, res, next) {
  res.render('user/all_articles');
});


router.get('/edit_profile', function(req, res, next) {
  res.render('user/edit_profile');
});
router.get('/uploads',(req,res)=>{
  student.find({_id:req.user._id})
  .exec((err,file)=>{
    if (err) throw err;
    else
      res.json(file);
      console.log(file);
  })
});
router.get('/pro', function(req, res, next) {
  //var a = toString(req.user._id);
  //var id = mongoose.Types.ObjectId(a);
  student.findById(req.user._id).populate('Index')
  .exec((err,file)=>{
    if(err)
      console.log(err);
    if(file){
      console.log(file.Index);
      //console.log("tejaskumar");
      res.render('user/pro',{student:file});
    }
  });
  
});
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
    res.json(files);
    console.log(files);
  },(err)=>next(err))
  .catch((err)=>next(err));
})


module.exports = router;
