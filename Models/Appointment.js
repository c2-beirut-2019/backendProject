let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let appointmentModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    appointmentType: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment_Type'
    },
    startDate: Date,
    endDate: Date,
    is_confirmed: {type: Boolean, default: false},
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Appointment', appointmentModel);
