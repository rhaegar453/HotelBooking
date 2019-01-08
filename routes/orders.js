var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Order = require('../models/Orders');

var respond = require('../config/respond');
var passport = require('passport');
require('../config/passport')(passport);



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


router.post('/new', passport.authenticate('jwt', {session:false}), (req, res)=>{
    var token=getToken(req.headers);
    if(token){
        var newOrder=new Order({
            orderedBy:req.headers.id,
            roomsFor:req.body.roomsFor,
            hotelId:req.headers.hotelId,
            arrivalDate:req.body.arrivalDate,
            departureDate:req.body.departureDate
        });
    }else
    return res.json(respond(false, 'Unauthorized'));
});

router.put('/:id', passport.authenticate('jwt', {session:false}),(req, res)=>{
    var token=getToken(req.headers);
    if(token){
        Order.findOneAndUpdate({_id:req.params.id},{
            orderedBy:req.headers.id,
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




