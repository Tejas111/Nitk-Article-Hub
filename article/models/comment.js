var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var commentSchema = new Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    comment:{type:String},
    article:{type:mongoose.Schema.Types.ObjectId,ref:'article'},
    date: { type: Date, default: Date.now() }
});

var comment = mongoose.model('comment',commentSchema);
module.exports = comment;