var express = require('express');
var uploadRouter = express.Router();
var bodyParser = require('body-parser');
var article = require('../models/article');
var multer = require('multer');
var path = require('path');
//config multer
var students =require('../models/userdetail');
var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/uploadnew/')
    },
    filename:(req,file,cb)=>{
        cb(null,req.user._id+'.png');
    }
}
);

// const imageFileFilter = (req,file,cb)=>{
//     if(!file.originalname.match(/\.(pdf)$/)){
//         return cb(new Error('You can upload pdf files!'),false);
//     }
//     cb(null,true);
// };
const upload = multer({storage:storage});

uploadRouter.use(bodyParser.json());
uploadRouter.route('/')

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
                        res.redirect(401,'/');
                    }
                    else {
                        if (file) {
                            console.log(" in profile page 1b ");
                            
                            
                            console.log(file)
                            res.render('user/edit_profile', {student: file});
                        }
                        else {
                            console.log(" in profile page 1c ");
                            res.render('user/edit_profile');
                        }
                    }

                });


        }
        else
        {
        }
    })
    .post(upload.single('image'),(req, res, next) =>{
            console.log(req.body);
         
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
                            // var a = req.user._id +path.extname(req.file.originalname);
                             var url = '/user/profile';
                            res.redirect(url);
                        }
                    });




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
            
          });
module.exports= uploadRouter;