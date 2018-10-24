var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var commentSchema = new Schema({
    by:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    comment:{type:String},
    article:{type:mongoose.Schema.Types.ObjectId,ref:'article'}
});

var comment = mongoose.model('comment',commentSchema);
module.exports = comment;