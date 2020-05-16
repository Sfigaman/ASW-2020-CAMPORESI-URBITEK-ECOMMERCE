var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
        code:  String,
        name: String,
        description: String,
        price: Number,
        discount: Number,
        type: String,
}, { versionKey: false });
var Product = mongoose.model('Product', ProductSchema);

exports.product = function() {
    return Product;
}
