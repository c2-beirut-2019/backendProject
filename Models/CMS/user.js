let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

let userModel = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    phoneNumber: String,
    registrationDate: {
        type: Date,
        default: new Date(),
        select: false
    },
    lastLogin: Date,
    emailVerified: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    language: {
        type: String,
        default: 'en'
    },
    profiles: [Schema.Types.ObjectId],
    __v: {type: Number, select: false}
});
userModel.plugin(mongoosePaginate);
module.exports = mongoose.model('CMSUser', userModel);
