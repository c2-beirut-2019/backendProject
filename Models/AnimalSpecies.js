let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let animalSpeciesModel = new Schema({
    name: String,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Animal_Specie', animalSpeciesModel);
