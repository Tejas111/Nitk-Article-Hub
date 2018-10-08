var express = require('express');
var router = express.Router();
var student = require('../models/userdetail');
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
router.get('/pro', function(req, res, next) {
  var a = toString(req.user._id);
  student.findById({"_id":ObjectId(a)},(err,file)=>{
    if(err)
      console.log(err);
    if(file){
      console.log(file);
      res.render('user/pro',{student:student});
    }
  });
  
});
router.get('/new_article', function(req, res, next) {
  res.render('user/new_article');
});
router.get('/article', function(req, res, next) {
  res.render('search/article');
});



module.exports = router;
