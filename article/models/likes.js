var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var likeschema = new Schema({
    by:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    like:{type:Number},
    article:{type:mongoose.Schema.Types.ObjectId,ref:'article'},
});

var like = mongoose.model('like',likeschema);
module.exports = like;