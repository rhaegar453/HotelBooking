var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Hotel=require('../models/Hotel');

var respond=require('../config/respond');

//get all hotels
router.get('/', (req, res ,next)=>{
    console.log(req.headers)
    Hotel.find().
    then((hotels)=>{
        return res.json(respond(true, hotels));
    })
    .catch((err)=>{
        return res.json(respond(false,err));
    })
});

//get a hotel
router.get('/:id', (req, res, next)=>{
    Hotel.findOne({_id:req.params.id}).
    then((data)=>{
        return res.json(respond(true, data));
    }).
    catch((err)=>{
        return res.json(respond(false, err));
    })
});


//post a hotel
router.post('/new', (req, res, next)=>{
    console.log(req.body);
    Hotel.create(req.body).then((data)=>{
        return res.json(respond(true, data));
    }).catch((err)=>{
        return res.json(respond(false, err));
    });
});

//edit a hotel
router.put('/:id',(req, res, next)=>{
    Hotel.findOneAndUpdate({_id:req.params.id},req.body, {upsert:true, new:true}).then((data)=>{
        return res.json(respond(true, data));
    }).catch(err=>{
        return res.json(respond(false, err));
    });
})




module.exports=router;

