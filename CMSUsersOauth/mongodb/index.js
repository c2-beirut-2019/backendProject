let db = {};
db.OAuthAccessToken = require('./OAuthAccessToken');
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode');
db.OAuthClient = require('./OAuthClient');
db.OAuthRefreshToken = require('./OAuthRefreshToken');
db.OAuthScope = require('./OAuthScope');
db.User = require('../../Models/CMS/user');

module.exports = db;
