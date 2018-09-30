var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
 var Grid = require('gridfs-stream');
 var mongoose = require('mongoose');
 var config = require('../config');
 const path = require('path');
 var express = require('express');
 

var router = express.Router();
 //for multer file uploading
 var connect = mongoose.createConnection(config.mongourl,{useNewUrlParser:true});
 
 connect.then((db) => {
   console.log("Connected correctly to mongoDb");
 }, (err) => { console.log(err); });
//Initialize gfs
let gfs;
connect.once('open', function () {
    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection('uploads');
  
    // all set!
  })
 const storage = new GridFsStorage({
     url:config.mongourl,
     file:(req,file)=>{
         console.log(req.body);
         
         return {
            
             filename:req.body.tejas+'hello',
             metadata:req.body,
             bucketName:'uploads'
         }
     }

 });
  const upload = multer({storage});

router.post('/',upload.single('pdf',),(req,res)=>{
    console.log(req.body);
    res.json({file:req.file});
});
module.exports=router;
  // for storing the files using multer