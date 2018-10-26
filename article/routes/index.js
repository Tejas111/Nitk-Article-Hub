var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var student = require('../models/userdetail');
var mongoose = require('mongoose');
var users = require('../models/user');
var comments= require('../models/comment');
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


router.get('/edit_profile', function(req, res, next) {
  res.render('user/edit_profile');
});


router.get('/about', function(req, res, next) {
  res.render('about');
});




router.post('/search', function(req, res, next) {
    article.find({'title' : { '$regex' : req.body.keywords, '$options' : 'i' }}).populate('author')
        .exec((err,file)=>{
            if (err) throw err;
            else
            {
              console.log(file);
                res.render('search/articles',{articles :file});
            }
        });

});

router.get('/search/articles/:id',(req,res)=> {

    article.findOne({ _id : req.params.id}).populate('author')
        .exec((err, articles) => {
            if (err) {

                console.log(err);
                res.redirect('/');
            }
            else {
                comments.find({ article: req.params.id}).populate('student')
                    .exec((err, comments) => {
                        if (err) {

                            console.log(err);
                            res.redirect('/');
                        }
                        else {
                            console.log("---------------------");
                            console.log(comments);
                            res.render('search/article',{article : articles ,comments :comments});
                        }
                    });

            }
        });

});





/*
router.get('/uploads',(req,res)=>{
  student.find({_id:req.user._id})
  .exec((err,file)=>{
    if (err) throw err;
    else
      res.json(file);
      console.log(file);
  })
});

router.get('/multer', function(req, res, next) {
  res.render('multer');
});


router.get('/all_articles', function(req, res, next) {
  res.render('user/all_articles');
});



router.get('/new_article', function(req, res, next) {
  res.render('user/new_article');
});
router.get('/article', function(req, res, next) {
  res.render('search/article');
});

router.get('/myuploads',function(req,res,next){
  article.find({uploaded:req.user._id})
  .then((files)=>{
    res.json(files);
    console.log(files);
  },(err)=>next(err))
  .catch((err)=>next(err));
})*/


module.exports = router;
