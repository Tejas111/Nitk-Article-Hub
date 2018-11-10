var express = require('express');
var bodyParser = require('body-parser');
const Router = express.Router();
var article = require('../models/article');
Router.use(bodyParser.json());
var mongoose = require('mongoose');
var students = require('../models/userdetail');
var comments = require('../models/comment');
var replies = require('../models/reply');
var authenticate = require('../authenticate');
var follow = require('../models/follow');
var multer = require('multer');
// var multer2 = require('multer');
var path = require('path');
//for nodemailer
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nitk.article@gmail.com',
    pass: 'nitk@ita'
  }
});

//config multer

var storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/')
        },
          filename:(req,file,cb)=>{
              console.log("**************************************");
              console.log(req.body);
              console.log(req.file);
              console.log("**************************************");
              cb(null, req.user._id+ '-' + Date.now() + path.extname(file.originalname));
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


Router.route('/new_article')
    .get((req,res,next)=>{
        res.render('user/new_article');
    })

    .post(upload.single('pdf'),(req,res,next)=>{

        students.findOne({ Index: req.user._id })
            .exec((err, file) => {
                if (err) {
                    console.log(" in new_article page 1a ");
                    console.log(err);
                    res.redirect('/user/profile')
                }
                else {
                    req.body.author = file._id;
                    console.log("-------------------------------------");
                    console.log(req.body);
                    console.log("-------------------------------------");
                    req.body.filename = req.file.filename;
                    follow.find({followed_to:file._id}).
                    exec((err,files)=>{
                        if(err) throw(err);
                        if(files){
                            console.log(files)
                            for(i=0;i<files.length;i++){
                                students.findOne({Index:files[i].followed_by})
                                .exec((err,file1)=>{
                                    if(err) throw(err);
                                    console.log(typeof file1.email);
                                    if(file1){
                                        var mailOptions = {
                                            from: 'nitk.article@gmail.com',
                                            to: file1.email,
                                            subject: 'REGARDING THE FOLLOWING OF THE AUTHOR :'+file.firstname+''+file.lastname,
                                            html:'<h1>THE AUTHOR YOU HAVE HAS JUST UPLOADED THE FILE:</h1><br>'+'<h2>'+req.body.title+'</h2>'
                                          };
                                          
                                          transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              console.log('Email sent: ' + info.response);
                                            }
                                          });
                                    }
                                })
                            }
                            
                        }
                    });
                    article.create(req.body)
                        .then((article)=>{
                            console.log("+++++++++++++++++++++++");
                            console.log(req.file);
                            console.log("+++++++++++++++++++++++");
                            res.redirect('/user/profile');
                        },(err) => next(err))
                        .catch((err)=>next(err));
       

                }
            });


    });


Router.get('/', function(req, res, next) {
    console.log("hoooooooo................");
    if(req.session)
    {
        res.render('user/user_home');
    }else{
        res.redirect('/login');
    }

});


Router.get('/profile', function(req, res, next) {
    //var a = toString(req.user._id);
    //var id = mongoose.Types.ObjectId(a);
    console.log(" in profile page");
    if(req.user) {
        console.log(" in profile page 1 ");

        students.findOne({ Index: req.user._id })
            .exec((err, file) => {
                if (err) {
                    console.log(" in profile page 1a ");
                    console.log(err);
                    res.redirect('/user/edit_profile')
                }
                else {
                    if (file) {
                        console.log(" in profile page 1b ");
                        
                        console.log(file);
                        
                        res.render('user/pro', {student: file});
                    }
                    else {
                        console.log(" in profile page 1c ");
                        res.redirect('user/edit_profile');
                    }
                }

            });
    }
    else
    {      console.log(" in profile page 2");
        res.redirect('/login');
    }

});


//Configuring for upload of images




Router.get('/logout',(req,res)=>{
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else{
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

Router.get('/my_articles',(req,res)=>{



    students.findOne({ Index: req.user._id })
        .exec((err, file) => {
            if (err) {

                console.log(err);
                res.redirect('/login');
            }
            else {

                console.log(" in my article 1b ");


                article.find({ author: file._id})
                    .exec((err, articles) => {
                        if (err) {

                            console.log(err);
                            res.redirect('/user/profile');
                        }
                        else {
                            console.log(articles);
                            res.render('user/my_articles',{articles : articles});
                        }
                    });

            }

        });


});


Router.get('/my_articles/:id',(req,res)=> {

    article.findOne({ _id : req.params.id})
        .exec((err, articles) => {
            if (err) {

                console.log(err);
                res.redirect('/user/my_articles');
            }
            else {
                console.log(articles);
                res.render('user/my_article',{article : articles});
            }
        });

});

Router.post('/my_articles/:id',(req,res)=> {

    console.log("77777777777777777");
    console.log(req.params.id);
    console.log(req.body);
    console.log("77777777777777777");
    var obj={
        title: req.body.title,
        description:req.body.description,
        category: req.body.category
    };
    article.findByIdAndUpdate( req.params.id,{$set:obj},(err,file)=>{
        if(err) throw err;
        else{
            console.log("99999999999999999");
            console.log(file);
            console.log("9999999999999");
            res.redirect('/user/my_articles/:id');
        }
    });



});




Router.post('/search', function(req, res, next) {
    article.find({'title' : { '$regex' : req.body.keywords, '$options' : 'i' }}).populate('author')
        .exec((err,file)=>{
            if (err) throw err;
            else
            {
                console.log(file);
                res.render('user/search/articles',{articles :file});
            }
        });

});
//Ajax search of keywords
Router.post('/searchajax',(req,res)=>{
    article.find({'title':{ '$regex' : req.body.query, '$options' : 'i' }})
    .exec((err,file)=>{
        if (err) throw err;
        else
        {
            if(file.length!=0){
                var i;
                var output='';
                output='<ul class="list-unstyled">';
                for(i=0;i<file.length;i++ ){
                    output+='<li>'+file[i].title+'</li>'
                }
                output+='</ul>';
                res.send(output);
            }
           
        }
    })
})
//Ajax search for author
// Router.post('/searchajax2',(req,res)=>{
//     var a =req.body.query;
//    // article.find({$or:[{'firstname':{ /a/i }},{'lastname':{ '$regex' : req.body.query, '$options' : 'i' }}]}).populate('author')
//     .exec((err,file)=>{
//         if (err) throw err;
//         else
//         {
//             console.log(file);
//             if(file.length!=0){
//                 var i;
//                 var output='';
//                 output='<ul class="list-unstyled">';
//                 for(i=0;i<file.length;i++ ){
//                     output+='<li>'+file[i].title+'</li>'
//                 }
//                 output+='</ul>';
//                 res.send(output);
//             }
           
//         }
//     })
// })
//---------End of author ---------
Router.get('/search/articles/:id',(req,res)=> {

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




                                        console.log("---------------------");
                                        console.log(r);
                                        res.render('user/search/article',{article : articles ,comments :comments ,reply: r});
                                    }
                                });



                        }
                    });

            }
        });

});


Router.post('/search/articles/:id/comment',(req,res)=> {

    students.findOne({ Index: req.user._id})
        .exec((err, student) => {
            if (err) {
                console.log(" entered 1 ");
                console.log(err);
                res.redirect('/login');
            }
            else {
                console.log(" entered 2");
                var obj={

                  comment: req.body.comment,
                  article: mongoose.Types.ObjectId(req.params.id),
                  student:student._id
                };

               console.log(obj);
               console.log(student);

                comments.create(obj, function (err, comm) {
                    if (err) {
                        console.log(" entered 3");
                        console.log(err);
                        res.redirect('/user/search/articles/:id');
                    }
                    else
                    {
                        console.log(" entered 1 ");
                        var url='/user/search/articles/'+req.params.id;
                        res.redirect(url);
                    }

                });

            }
        });

});


Router.post('/search/articles/:id/:cid/reply',(req,res)=> {

    students.findOne({ Index: req.user._id})
        .exec((err, student) => {
            if (err) {
                console.log(" entered 1 ");
                console.log(err);
                res.redirect('/login');
            }
            else {
                console.log(" entered 2");
                comments.findOne({ _id: req.params.comment_id})
                    .exec((err, comment) => {
                        if (err) {
                            console.log(" entered 2 ");
                            console.log(err);
                            var ur='/search/articles/'+req.params.id;
                            res.redirect(ur);
                        }
                        else {

                            var obj={

                                reply: req.body.comment,
                                article: mongoose.Types.ObjectId(req.params.id),
                                comment: mongoose.Types.ObjectId(req.params.cid),
                                student:student._id
                            };



                            replies.create(obj, function (err, r) {
                                if (err) {
                                    console.log(" entered 3");
                                    console.log(err);
                                    res.redirect('/user/search/articles/'+req.params.id);
                                }
                                else
                                {
                                    console.log(" entered 4 ");
                                    var url='/user/search/articles/'+req.params.id;
                                    res.redirect(url);
                                }

                            });

                        }

                    });

            }
        });

});

// For the process of following
Router.post('/search/articles/:id/follow',(req,res,next)=>{
    req.body.followed_by = req.user._id;
    
    article.findById(req.params.id).populate('student')
    .then((file)=>{
        req.body.followed_to = file.author._id;
        req.body.followed_article = file._id;
        follow.findOne({followed_by:req.user._id,followed_to:file.author._id})
        .exec((err,file)=>{
            if(file){
                console.log("You have already followed the given author");
                var url = '/user/search/articles/'+req.params.id;
                res.redirect(200,url)
            }
            else{
                    follow.create(req.body)
                    .then((file)=>{
                        console.log("One follower Inserted After checking ");
                        var url = '/user/search/articles/'+req.params.id;
                        res.redirect(200,url)
                    },(err)=>next(err))
                    .catch((err)=>next(err));
                
            }
        })
    },(err)=>next(err))
    .catch((err)=>next(err));
})

module.exports=Router;