var express = require('express');
var bodyParser = require('body-parser');
const Router = express.Router();
Router.use(bodyParser.json());
var mongoose = require('mongoose');
var students = require('../models/userdetail');
var authenticate = require('../authenticate');
var flag =1;
Router.route('/')
.get((req,res)=>{
    res.render('user/edit_profile');
})
.post((req, res, next) => {
    //students.findOneAndUpdate({_id:req.user._id},req.body,(err)=>console.log(err));
    //if(!(students.findById(req.user._id))){
    req.body._id = req.user._id,
    //students.
    students.create(req.body)
    .then((student) => {
        // console.log('Student Created ', student);
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(student);
        //console.log('hello');
        res.redirect('/pro');
        res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));}

    
        // students.findByIdAndUpdate({_id:req.user._id},(err,file)=>{
        //     if(file)
        //         console.log("hello");
        //     else {
        //         console.log("jello");
        //     }
        //     students.set(req.body);
        //     });
        
        );

module.exports=Router;