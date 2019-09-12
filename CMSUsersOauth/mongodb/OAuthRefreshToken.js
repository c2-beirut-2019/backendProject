'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let RefreshTokenSchema = new Schema({
    refresh_token: String,
    expires: Date,
    scope: String,
    User: {type: Schema.Types.ObjectId, ref: 'CMSUser'},
    OAuthClient: {type: Schema.Types.ObjectId, ref: 'CMSOAuthClient'}
});

module.exports = mongoose.model('CMSRefreshToken', RefreshTokenSchema);
