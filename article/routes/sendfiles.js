var express = require('express');
var router = express.Router();
var path =require('path');
router.route('/')
.get((req,res)=>{
    //console.log(req.params);
    //console.log((path.join(__dirname, '../public','/images','angularjs.jpg')));
    res.sendFile((path.join(__dirname, '../uploads','tejas'+'.pdf')));
   //res.json("hello");
});
module.exports  = router;