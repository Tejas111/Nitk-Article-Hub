
var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var user_Schema = new Schema({
    Index:{type:mongoose.Schema.Types.ObjectId,ref:'User'},//req.user.id
    firstname:{type: String, required:true},
    lastname:{type: String, required:true},
    mobile:{type:Number},
    email:{type:String},
    address:{type:String,required:true},
   // Age:{type:Number,required:true,min:10,max:100},
    course:{type:String,required:true},
    branch:{type:String,required:true},
    //Mobile:{type:Number},
    //Date:{type:Date,default:Date.now()},
    //Uploads:[{type:Schema.Types.ObjectId,ref:'uploads.files'}]
});

var Users = mongoose.model('student',user_Schema);

module.exports = Users;