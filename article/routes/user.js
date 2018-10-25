var express = require('express');
var bodyParser = require('body-parser');
const Router = express.Router();
var article = require('../models/article');
Router.use(bodyParser.json());
var mongoose = require('mongoose');
var students = require('../models/userdetail');
var authenticate = require('../authenticate');

var multer = require('multer');
var path = require('path');
//config multer

var storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/')
        },
        filename:(req,file,cb)=>{
            console.log("**************************************");
            console.log(req.body);
            console.log("**************************************");
            cb(null,req.body.title+'.pdf')
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

                        article.create(req.body)
                            .then((article)=>{
                                console.log(article);
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



Router.route('/edit_profile')
    .get((req,res)=> {


        if (req.user)
         {


            console.log(".............................................................................");
            console.log(req.user._id);
            console.log("..............................................................................");

            students.findOne({Index: req.user._id})
                .exec((err, file) => {
                    if (err) {
                        console.log(" in edit profile page 1a ");
                        console.log(err);
                        res.redirect('/');
                    }
                    else {
                        if (file) {
                            console.log(" in profile page 1b ");
                            console.log(file);

                            res.render('user/edit_profile', {student: file});
                        }
                        else {
                            console.log(" in profile page 1c ");
                            res.redirect('user/edit_profile',{student: null});
                        }
                    }

                });


         }
    else
        {
        }
    })
    .post((req, res, next) => {
            students.findOne({ Index: req.user._id },(err,file)=>{
                if(err) throw err;
                var obj = { name: "Company Inc",

                    Index: req.user.id ,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    address: req.body.address,
                    // Age:{type:Number,required:true,min:10,max:100},
                    course: req.body.course ,
                    branch: req.body.branch,
                };
                if(file){
                    console.log("hhhhhhhhhhhhhhhhhhhhh");
                    console.log(file);
                    console.log("hhhhhhhhhhhhhhhhhhhhh");
                    students.findOneAndUpdate({ Index: req.user._id },{$set:obj},{new: true},(err,file)=>{
                        if(err) throw err;
                        else{
                            console.log(file);
                            res.redirect('/user/profile');
                        }
                    })




                }
                else{
                    //students.
                    students.create(obj)
                        .then((student) => {
                            console.log('Student Created ', student);
                            // res.statusCode = 200;
                            // res.setHeader('Content-Type', 'application/json');
                            // res.json(student);
                            //console.log('hello');
                            res.redirect('/user/profile');
                            //res.json(student);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            });
        }


    );


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

module.exports=Router;