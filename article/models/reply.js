var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },
    reply: { type: String },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'article' },
    date: { type: Date, default: Date.now() }
});


var reply = mongoose.model('reply', replySchema);
module.exports = reply;