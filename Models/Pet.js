let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let petModel = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Animal_Category'
    },
    specie: {
        type: Schema.Types.ObjectId,
        ref: 'Animal_Category'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    image:{},
    color: String,
    registrationDate: Date,
    dateOfBirth: Date,
    isToAdopt: {type: Boolean, default: false},
    isAdopted: {type: Boolean, default: false},
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Pet', petModel);
