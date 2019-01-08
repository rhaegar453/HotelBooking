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


router.post('/login', (req, res)=>{
    User.findOne({
        email:req.body.email
    }).then(user=>{
        if(!user){
            res.status(401).send(respond(false, 'Authentication failed. User not found'));
        }
    }).catch(err=>{
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(isMatch&&!err){
                var token=jwt.sign(user.toJSON(), settings
                .secret);
                return res.json(respond(true, {token:'JWT '+token}));
            }
            else{
                res.status(401).send(respond(false, 'Authentication Failed. Wrong password'));
            }
        })
    })
});



module.exports=router;