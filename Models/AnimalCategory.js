let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let animalCategoryModel = new Schema({
    name: String,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Animal_Category', animalCategoryModel);
