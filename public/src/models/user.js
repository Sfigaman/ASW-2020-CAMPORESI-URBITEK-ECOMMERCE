var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        username: String,
        password: String,
        name:  String,
        surname: String,
        company: String,
        mail: String,
        phone: Number,
        role: String,
        discount: Number,
        orders: [{ date: {type: Date, default: Date.now}, discount: Number, products: [{ productId: String, productName: String, quantity: Number, price: Number, discount: Number, _id: false }], _id: false }],
        cart: [{ productId: String, productName: String, quantity: Number, price: Number, discount: Number, _id: false }],
        favorites: [{ productId: String, productName: String, quantity: Number, price: Number, discount: Number, _id: false }]
}, { versionKey: false });
var User = mongoose.model('User', UserSchema);

exports.user = function() {
    return User;
}
