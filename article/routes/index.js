var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
var student = require('../models/userdetail');
var category = require('../models/category');
var art_cat = require('../models/art_cat');
var mongoose = require('mongoose');
var users = require('../models/user');
var comments= require('../models/comment');
var replies= require('../models/reply');
var article = require('../models/article');
var like = require('../models/likes');
/* GET home page. */
router.get('/', function(req, res, next) {
    category.find()
        .exec((err, file) => {
            if (err) throw err;
            else {
                console.log(file);
                student.count()
                    .exec((err, s) => {
                        if (err) throw err;
                        else {


                            article.count()
                                .exec((err, a) => {
                                    if (err) throw err;
                                    else {

                                        like.count()
                                            .exec((err, l) => {
                                                if (err) throw err;
                                                else {
                                                    comments.count()
                                                        .exec((err, com) => {
                                                            if (err) throw err;
                                                            else {


                                                                res.render('homepage',{cats:file,students:s,articles:a,likes:l,comments:com});

                                                            }
                                                        });



                                                }
                                            });



                                    }
                                });


                        }
                    });


            }
        });

});
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login',{message:req.query.message});
});


// router.get('/edit_profile', function(req, res, next) {
//   res.render('user/edit_profile');
// });


router.get('/about', function(req, res, next) {
  res.render('about');
});




router.post('/search', function(req, res, next) {
    if(req.body.keywords) {
        if(req.body.category ==0) {
            article.find({'title': {'$regex': req.body.keywords, '$options': 'i'}}).populate('author')
                .exec((err, file) => {
                    if (err) throw err;
                    else {
                        console.log(file);
                        res.render('search/articles', {articles: file,op:1});
                    }
                });
        }
        else
        {var id = mongoose.Types.ObjectId(req.body.category);
            art_cat.find({'category': id}).populate('article')
                .exec((err, file) => {
                    if (err) throw err;
                    else {
                        console.log(file);



                        res.render('search/articles', {articles: file ,op:2});




                    }
                });
        }

    }
    else if(req.body.author){

        student.find({'firstname': {'$regex': req.body.author, '$options': 'i'}})
            .exec((err, file) => {
                if (err) throw err;
                else {
                    console.log(file);
                    res.render('search/authors', {authors: file});
                }
            });
    }
    else
    {   if(category == 0) {
        article.find({'title': {'$regex': req.body.keywords, '$options': 'i'}}).populate('author')
            .exec((err, file) => {
                if (err) throw err;
                else {
                    console.log(file);
                    res.render('search/articles', {articles: file,op:1});
                }
            });
       }
       else
            {
                var id = mongoose.Types.ObjectId(req.body.category);
                art_cat.find({'category': id}).populate( 'article')
                    .exec((err, file) => {
                        if (err) throw err;
                        else {
                            console.log(file);



                            res.render('search/articles', {articles: file ,op:2});
                        }
                    });
            }

    }

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

                            replies.find({ article: req.params.id}).populate('student')
                                .exec((err, r) => {
                                    if (err) {

                                        console.log(err);
                                        res.redirect('/');
                                    }
                                    else {
                                        like.find().populate({path:'liked_article',match:{author:articles.author._id}})
                                    .exec((err,result)=>{
                                        console.log(result);

                                        likes = result.length;
                                        if(err) throw err;
                                        else{
                                            console.log("---------------------");
                                        console.log(r);
                                        res.render('search/article',{article : articles ,comments :comments ,reply: r,likes:likes});
                                        }
                                    });
                                        var message = req.flash('info');


                                        
                                    }
                                });



                        }
                    });

            }
        });
});



// for the sake of like

router.get('/search/authors/:id',(req,res)=> {

    student.findOne({ _id : req.params.id})
        .exec((err, author) => {
            if (err) {

                console.log(err);
                res.redirect('/');
            }
            else {

                            res.render('search/author',{student: author});


            }
        });

});



router.get('/search/author/:id/articles',(req,res)=> {

    article.find({'author':req.params.id }).populate('author')
        .exec((err, file) => {
            if (err) throw err;
            else {
                console.log(file);
                res.render('search/articles', {articles: file});
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
