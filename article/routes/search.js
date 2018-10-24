var express = require('express');
var search= express.Router();
var bodyParser = require('body-parser');
var article = require('../models/article');

search.use(bodyParser.json());
search.route('/')
.get((req,res,next)=>{
    article.find({
        name:{$regex:/^ba/i}
    })
    .then((file)=>{
        res.json(file);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
module.exports= search;