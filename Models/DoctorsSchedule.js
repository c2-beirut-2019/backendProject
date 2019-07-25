let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let doctorScheduleModel = new Schema({
    day: Number,
    day_name: String,
    Doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    from_time: Date,
    to_time: Date,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('Doctor_Schedule', doctorScheduleModel);
