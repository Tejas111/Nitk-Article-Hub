
/* GET users listing. */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('../models/user');
var students = require('../models/userdetail');
var passport = require('passport');
//router.use(bodyParser.urlencoded({extended:true,type:'application/x-www-form-urlencode'}));
var authenticate = require('../authenticate');


/* GET users listing. */

//for the signup route
//console.log(req.body);
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname)
       user.firstname = req.body.firstname;
      if(req.body.lastname)
       user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
  });
};
    });
  });
//passing back the token once authenticated
router.post('/login', passport.authenticate('local'), (req, res) => {
  //var token = authenticate.getToken({_id:req.user._id});
  res.redirect('/userdetail');
});


router.get('logout',(req,res)=>{
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

module.exports=router;