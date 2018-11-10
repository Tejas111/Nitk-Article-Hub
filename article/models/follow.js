var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var followSchema = new Schema({
    followed_to:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    followed_by:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
    followed_article:{type:mongoose.Schema.Types.ObjectId,ref:'article'},
    date: { type: Date, default: Date.now() }
    // follower_email:{type:string}
});

var follow = mongoose.model('follow',followSchema);
module.exports = follow;