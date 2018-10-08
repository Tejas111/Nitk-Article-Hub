var express = require('express');
var router = express.Router();

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

router.get('/profile', function(req, res, next) {
  res.render('user/profile');
});

router.get('/edit_profile', function(req, res, next) {
  res.render('user/edit_profile');
});
router.get('/new_article', function(req, res, next) {
  res.render('user/new_article');
});
router.get('/article', function(req, res, next) {
  res.render('search/article');
});



module.exports = router;
