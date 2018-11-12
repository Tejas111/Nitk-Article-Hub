var mongoose = require('mongoose');
var Schema= mongoose.Schema;

var category_schema = new Schema({
    category:{type:String,required:true,lowercase:true},

});

var category = mongoose.model('category',category_schema);
module.exports=category;