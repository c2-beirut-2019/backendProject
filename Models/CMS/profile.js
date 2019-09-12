let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

let profileModel;
profileModel = new Schema({
    name: {
        type: String,
        unique: true
    },
    permissions: Object,
    default: {
        type: Boolean,
        default: false
    },
    __v: {type: Number, select: false}
});
profileModel.plugin(mongoosePaginate);
module.exports = mongoose.model('Profile', profileModel);
