let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let animalSpeciesModel = new Schema({
    name: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Animal_Category'
    },
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Animal_Specie', animalSpeciesModel);
