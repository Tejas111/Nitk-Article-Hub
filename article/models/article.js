var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var article_schema = new Schema({
    title: {type:String, required:true,lowercase:true},
    description:  {type:String, required:true,lowercase:true},

    filename:{type:String,required:true,lowercase:true},
    //comments:[String],

    //likes:{type:Number,default:0},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    date: { type: Date, default: Date.now()}
    
});

var article = mongoose.model('article',article_schema);
module.exports=article;