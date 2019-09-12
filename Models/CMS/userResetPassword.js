let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userResetPasswordModel = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    __v: {type: Number, select: false}
});
module.exports = mongoose.model('CMSUserResetPassword',userResetPasswordModel);
