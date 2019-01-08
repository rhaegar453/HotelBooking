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
        required:[true, 'Hotel ID is']
    },
    orderDate:{
        type:Date,
        default:Date.now(),
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
});


orderSchema.pre("save", function(next){
    var order=this;
    if(order.startDate>order.endDate){
        next(new Error('End Date must be greater than the start date'));
    }
    else
    next();
});

module.exports=mongoose.model('orders',orderSchema);