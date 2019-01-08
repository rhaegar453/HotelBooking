var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Hotel = require('../models/Hotel');

var respond = require('../config/respond');
var passport = require('passport');
require('../config/passport')(passport);
var settings = require('../config/settings');
var async=require('async');


var jwt = require('jsonwebtoken');

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

function getDetails(token) {
    var value = jwt.verify(token, settings.secret)
    return {
        email: value.email,
        username: value.username,
        id: value._id
    };
}

async function getHotel(id){
    var details = getDetails(token);
    return await Hotel.findOne({
        _id:id
    });
}

//get all hotels
//works
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    console.log(req.headers)
    var token = getToken(req.headers);
    if (token) {
        Hotel.find().
        then((hotels) => {
                return res.json(respond(true, hotels));
            })
            .catch((err) => {
                return res.json(respond(false, err));
            })
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
});
//Get all reviews for a hotel
//Works
router.get('/review/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        Hotel.findOne({
            _id: req.params.id
        }).then(data => {
            return data
        }).then(data => {
            return res.json(respond(true, data.reviews));
        }).catch(err => {
            return res.json(respond(false, err))
        });
    }
});




//get details for a particular hotel
//Works
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    if (token) {
        Hotel.findOne({
            _id: req.params.id
        }).
        then((data) => {
            return res.json(respond(true, data));
        }).
        catch((err) => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
});



//post a hotel
//Works 
router.post('/new', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    var userDetails = getDetails(token);
    if (token) {

        var hotel = new Hotel({
            hotelName: req.body.hotelName,
            hostedBy: userDetails.id
        });

        hotel.save().then(data => {
            return res.json(respond(true, data))
        }).catch(err => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
});


//Works
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    var details=getDetails(token);
    // return res.json(details);
    if (token) {
        Hotel.deleteOne({
            _id: req.params.id
        }).then((data) => {
            return res.json(respond(true, "Deleted Hotel Successfully"));
        }).catch(err => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }

    var details= getDetails(token);
    
    return res.json(getHotel(req.params.id));

});

//edit a hotel
router.put('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    if (token) {
        Hotel.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            upsert: true,
            new: true
        }).then((data) => {
            return res.json(respond(true, data));
        }).catch(err => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
});


module.exports = router;