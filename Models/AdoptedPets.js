let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let adoptedPetModel = new Schema({
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    },
    ownerFirstName: String,
    ownerLastName: String,
    ownerPhoneNumber: String,
    dateOfAdoption: String,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Adopted_Pet', adoptedPetModel);
