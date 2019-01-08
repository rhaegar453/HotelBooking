var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var orderSchema=new Schema({
    orderedBy:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    roomsFor:{
        type:Number,
        required:true,
        max:6
    },
    hotelId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    arrivalDate:{
        type:Date,
        required:true
    },
    departureDate:{
        type:Date,
        required:true
    }
});


module.exports=mongoose.model('orders',orderSchema);