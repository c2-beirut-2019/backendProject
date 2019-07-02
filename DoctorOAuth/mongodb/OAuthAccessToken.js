'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let OAuthAccessTokenSchema = new Schema({
    access_token: String,
    expires: Date,
    scope: String,
    User: {type: Schema.Types.ObjectId, ref: 'Doctor'},
    OAuthClient: {type: Schema.Types.ObjectId, ref: 'DoctorOAuthClient'}
});

module.exports = mongoose.model('DoctorOAuthAccessToken', OAuthAccessTokenSchema);
