'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let OAuthAuthorizationCodeSchema = new Schema({
    authorization_code: String,
    expires: Date,
    redirect_uri: String,
    scope: String,
    User: {type: Schema.Types.ObjectId, ref: 'CMSUser'},
    OAuthClient: {type: Schema.Types.ObjectId, ref: 'CMSOAuthClient'}
});

module.exports = mongoose.model('CMSOAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
