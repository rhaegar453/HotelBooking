var mongoose=require('mongoose');
var passport=require('passport');

var settings=require('../config/settings');
var express=require('express');
var jwt=require('jsonwebtoken');
var router=express.Router();
var respond=require('../config/respond');
var User=require('../models/User');

router.post('/register', (req, res)=>{
    if(!req.body.email||!req.body.password){
        res.json(respond(false, 'Please pass the username and password'));
    }
    else{
        var newUser=new User({
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            city:req.body.city
        });

        newUser.save().then(data=>{
            return res.json(respond(true, 'Successfully registered! Welcome aboard'));
        }).catch(err=>{
            return res.json(respond(false,err));
        });
    }
});

router.post('/login', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });



module.exports=router