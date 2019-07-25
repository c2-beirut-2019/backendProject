let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userModel = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    activationCode: String,
    isActive: {type: Boolean, default: true},
    lastLoginDate: Date,
    registrationDate: Date,
    dateOfBirth: Date,
    phoneNumber: String,
    referredBy: String,
    emergencyPerson: String,
    emergencyNumber: String,
    password: String,
    profilePic: {},
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('User', userModel);
