var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var likeschema = new Schema({
    // liked_to:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    liked_by:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    // like:{type:Number},
    liked_article:{type:mongoose.Schema.Types.ObjectId,ref:'article'},

});

var like = mongoose.model('like',likeschema);
module.exports = like;