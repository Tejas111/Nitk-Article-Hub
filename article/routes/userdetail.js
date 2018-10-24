var express = require('express');
var bodyParser = require('body-parser');
const Router = express.Router();
Router.use(bodyParser.json());
var mongoose = require('mongoose');
var students = require('../models/userdetail');
var authenticate = require('../authenticate');
Router.route('/')
.get((req,res)=>{
    res.render('user/edit_profile');
})
.post((req, res, next) => {
    students.findById(req.user._id,(err,file)=>{
        if(err) throw err;
        if(!file){
            req.body._id = req.user._id,
            req.body.Index = req.user._id,
            req.body.Uploads = req.user._id,
    //students.
    students.create(req.body)
    .then((student) => {
         console.log('Student Created ', student);
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(student);
        //console.log('hello');
        res.redirect('/pro');
        //res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));
        }
        else{
            students.findByIdAndUpdate(req.user._id,{$set:req.body},{new: true},(err,file)=>{
                if(err) throw err;
                else{
                console.log(file);
                res.redirect('/pro');
                }
            })
        }
    });
    }
   
 
);

module.exports=Router;