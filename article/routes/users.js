
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
 // console.log(req.body);
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
     // res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {

        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(user);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
        var obj={
          Index: user._id,

          };


        students.create(obj, function (err, student) {
            if (err) {
                console.log(err);

            }
            else
            {
                console.log('Student Created ', student);
                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                // res.json(student);
                //console.log('hello');
                res.redirect('/login');
            }

            // saved!
        });



      passport.authenticate('local')(req, res, () => {
        res.redirect('/login');
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log(req.user);
 res.redirect('/user/edit_profile');
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