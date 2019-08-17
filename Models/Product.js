let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let productModel = new Schema({
    title: String,
    description: String,
    price: Number,
    quantityAvailable: Number,
    colorsAvailable: [String],
    createDate: Date,
    images: [String],
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Product', productModel);
