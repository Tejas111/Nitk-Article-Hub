var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var article_schema = new Schema({
    name:{type:String, required:true, unique:true,lowercase:true},
    author:{type:String, required:true,lowercase:true},
    category:{type:String,required:true,lowercase:true},
    //comments:[String],
    //likes:{type:Number,default:0},
    uploaded:{type:mongoose.Schema.Types.ObjectId,ref:'student',index:true}

});

var article = mongoose.model('article',article_schema);
module.exports=article;