let oauthServer = require('oauth2-server');
let oauth = new oauthServer({
    model: require('./models.js'),
    accessTokenLifetime: 60 * 60 * 6,
    refreshTokenLifetime: 60 * 60 * 7,
    debug: true
});

module.exports = oauth;
