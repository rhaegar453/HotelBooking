var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Hotel = require('../models/Hotel');

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


//get all hotels
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
//Get all reviews
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


//post rewiew
router.post('/review/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    var token = getToken(req.headers);
    if (token) {
        var review = {
            reviewBy: req.headers.id,
            reviewDescription: req.body.description
        }
        Hotel.update({
            _id: req.params.id
        }, 
        {
            $push: {
                reviews: review
            }
        }).then(data=>{
            res.json(respond(true, data));
        }).catch(err=>{
            res.json(respond(false, err));
        });
    }
});

//get a hotel
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
router.post('/new', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    if (token) {
        Hotel.create(req.body).then(data => {
            console.log(data);
            return res.json(respond(true, data));
        }).catch(err => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
});

router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    var token = getToken(req.headers);
    console.log(token);
    if (token) {
        Hotel.deleteOne({
            _id: req.params.id
        }).then((data) => {
            return res.json(respond(true, data));
        }).catch(err => {
            return res.json(respond(false, err));
        });
    } else {
        return res.json(respond(false, 'Unauthorized'));
    }
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