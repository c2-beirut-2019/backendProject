let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let doctorModel = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    speciality: String,
    diplomas: String,
    activationCode: String,
    isActive: {type: Boolean, default: true},
    lastLoginDate: Date,
    registrationDate: Date,
    dateOfBirth: Date,
    phoneNumber: String,
    password: String,
    profilePic: String,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Doctor', doctorModel);
