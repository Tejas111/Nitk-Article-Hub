var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var art_cat_schema = new Schema({
    article:{type:mongoose.Schema.Types.ObjectId,ref:'article'},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'category'}

});

var art_cat = mongoose.model('art_cat',art_cat_schema);
module.exports=art_cat;