'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let OAuthAccessTokenSchema = new Schema({
    access_token: String,
    expires: Date,
    scope: String,
    User: {type: Schema.Types.ObjectId, ref: 'User'},
    OAuthClient: {type: Schema.Types.ObjectId, ref: 'UserOAuthClient'}
});

module.exports = mongoose.model('UserOAuthAccessToken', OAuthAccessTokenSchema);
