let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let productModel = new Schema({
    title: String,
    description: String,
    price: Number,
    quantityAvailable: Number,
    colorsAvailable: [String],
    images: [],
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Product', productModel);
