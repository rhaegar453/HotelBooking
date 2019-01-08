var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var hotelSchema=new Schema({
    hotelName:{
        type:String,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    hostedBy:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    reviews:[
        {
            reviewBy:mongoose.Types.ObjectId,
            reviewDescription:String
        }
    ]
});

module.exports=mongoose.model('Hotel', hotelSchema);
