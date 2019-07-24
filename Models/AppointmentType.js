let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let appointmentTypeModel = new Schema({
    name: String,
    procedureTime: Number,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Appointment_Type', appointmentTypeModel);
