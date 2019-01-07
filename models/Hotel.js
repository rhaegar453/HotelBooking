var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var hotelSchema=new Schema({
    hotelName:{
        type:String,
        required:true
    },
    hotelImages:[String],
    dateCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports=mongoose.model('Hotel', hotelSchema);
