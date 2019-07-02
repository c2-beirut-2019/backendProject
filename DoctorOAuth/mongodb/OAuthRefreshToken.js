'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let RefreshTokenSchema = new Schema({
    refresh_token: String,
    expires: Date,
    scope: String,
    User: {type: Schema.Types.ObjectId, ref: 'Doctor'},
    OAuthClient: {type: Schema.Types.ObjectId, ref: 'DoctorOAuthClient'}
});

module.exports = mongoose.model('DoctorRefreshToken', RefreshTokenSchema);
