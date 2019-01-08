var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Order = require('../models/Orders');

var respond = require('../config/respond');
var passport = require('passport');
require('../config/passport')(passport);
var jwt=require('jsonwebtoken');
var settings=require('../config/settings');

var getToken = (headers) => {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1]
        } else {
            return null
        }
    }
}
var getDetails=(token)=>{
    var value=jwt.verify(token, settings.secret);
    return {
        email:value.email,
        username:value.username,
        id:value._id
    }
}


router.get('/orders', passport.authenticate('jwt', {session:false}), (req, res)=>{
    var token=getToken(req.headers);
    if(token){
        Order.find().then(data=>{
            return res.json(respond(true, data));
        }).catch(err=>{
            return res.json(respond(false, err));
        })
    }else{
        return res.json(respond(false, 'Unauthorized'));
    }
});

//Note that the hotelId is passed from inside of the headers
router.post('/new', passport.authenticate('jwt', {session:false}), (req, res)=>{
    var token=getToken(req.headers);
    var details=getDetails(token);
    if(token){
        var newOrder=new Order({
            orderedBy:details.id,
            roomsFor:req.body.roomsFor,
            hotelId:req.headers.id,
            startDate:req.body.startDate,
            endDate:req.body.endDate
        });
        newOrder.save().then(data=>{
            return res.json(respond(true, data));
        }).catch(err=>{
            return res.json(respond(false, err));
        })
    }
});

router.put('/:id', passport.authenticate('jwt', {session:false}),(req, res)=>{
    var token=getToken(req.headers);
    var details=getDetails(token);
    if(token){
        Order.findOneAndUpdate({_id:req.params.id},{
            orderedBy:details.id,
            roomsFor:req.body.roomsFor,
            hotelId:req.headers.hotelId,
            arrivalDate:req.body.arrivalDate,
            departureDate:req.body.departureDate
        }, {upsert:true,new:true}).
        then(data=>{
            return res.json(respond(true, data));
        }).catch(err=>{
            return res.json(respond(false, err));
        });
    }
    else{
        return res.json(respond(false, 'Unauthorized'));
    }
});


module.exports=router;




