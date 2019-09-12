let _ = require('lodash'),
    mongodb = require('./mongodb'),
    User = mongodb.User,
    OAuthClient = mongodb.OAuthClient,
    OAuthAccessToken = mongodb.OAuthAccessToken,
    OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode,
    OAuthRefreshToken = mongodb.OAuthRefreshToken;

function getAccessToken(bearerToken) {
    return OAuthAccessToken
        .findOne({access_token: bearerToken})
        .populate('User')
        .populate('OAuthClient')
        .then((accessToken) => {
            if (!accessToken) return false;
            accessToken.accessTokenExpiresAt = accessToken.expires;
            let token = accessToken;
            token.user = token.User;
            token.client = token.OAuthClient;
            token.scope = token.scope;
            return token;
        })
        .catch((err) => {
            console.log("getAccessToken - Err: ", err)
        });
}

function getClient(clientId, clientSecret) {
    const options = {client_id: clientId};
    if (clientSecret) options.client_secret = clientSecret;
    return OAuthClient
        .findOne(options)
        .then((client) => {
            if (!client) return new Error("client not found");
            let clientWithGrants = client;
            clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials'];
            clientWithGrants.redirectUris = [clientWithGrants.redirect_uri];
            delete clientWithGrants.redirect_uri;
            return clientWithGrants
        }).catch((err) => {
            console.log("getClient - Err: ", err)
        });
}


function getUser(username, password) {
    return User
        .findOne({email: username})
        .then((user) => {
            return user.password === password ? user : false;
        })
        .catch((err) => {
            console.log("getUser - Err: ", err)
        });
}

function revokeAuthorizationCode(code) {
    return OAuthAuthorizationCode.findOne({
        where: {
            authorization_code: code.code
        }
    }).then(() => {
        let expiredCode = code;
        expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z');
        return expiredCode
    }).catch((err) => {
        console.log("getUser - Err: ", err)
    });
}

function revokeToken(token) {
    return OAuthRefreshToken.findOne({
        where: {
            refresh_token: token.refreshToken
        }
    }).then((rT) => {
        if (rT) rT.destroy();
        let expiredToken = token;
        expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000Z');
        return expiredToken
    }).catch((err) => {
        console.log("revokeToken - Err: ", err)
    });
}

function saveToken(token, client, user) {
    return token.refreshToken ? Promise.all([
        OAuthAccessToken.findOneAndUpdate({User: user._id}, {
            access_token: token.accessToken,
            expires: token.accessTokenExpiresAt,
            OAuthClient: client._id,
            User: user._id,
            scope: token.scope
        }, {upsert: true}),
        OAuthRefreshToken.findOneAndUpdate({User: user._id}, {
            refresh_token: token.refreshToken,
            expires: token.refreshTokenExpiresAt,
            OAuthClient: client._id,
            User: user._id,
            scope: token.scope
        }, {upsert: true}),
    ])
        .then(() => {
            console.log('T', token);
            return _.assign(
                {
                    client: client,
                    user: user,
                    access_token: token.accessToken,
                    refresh_token: token.refreshToken
                },
                token
            )
        })
        .catch((err) => {
            console.log("revokeToken - Err: ", err)
        }) : Promise.all([
        OAuthAccessToken.findOneAndUpdate({User: user._id}, {
            access_token: token.accessToken,
            expires: token.accessTokenExpiresAt,
            OAuthClient: client._id,
            User: user._id,
            scope: token.scope
        }, {upsert: true}),
        []

    ])
        .then(() => {
            console.log('T', token);
            return _.assign(
                {
                    client: client,
                    user: user,
                    access_token: token.accessToken,
                    refresh_token: token.refreshToken
                },
                token
            )
        })
        .catch((err) => {
            console.log("revokeToken - Err: ", err)
        });
}

function getAuthorizationCode(code) {
    return OAuthAuthorizationCode
        .findOne({authorization_code: code})
        .populate('User')
        .populate('OAuthClient')
        .then((authCodeModel) => {
            if (!authCodeModel) return {};
            let client = authCodeModel.OAuthClient;
            let user = authCodeModel.User;
            return {
                code: code,
                client: client,
                expiresAt: authCodeModel.expires,
                redirectUri: client.redirect_uri,
                user: user,
                scope: authCodeModel.scope
            };
        }).catch((err) => {
            console.log("getAuthorizationCode - Err: ", err)
        });
}

function saveAuthorizationCode(code, client, user) {
    return OAuthAuthorizationCode
        .create({
            expires: code.expiresAt,
            OAuthClient: client._id,
            authorization_code: code.authorizationCode,
            User: user._id,
            scope: code.scope
        })
        .then(() => {
            code.code = code.authorizationCode;
            return code
        }).catch((err) => {
            console.log("saveAuthorizationCode - Err: ", err)
        });
}

function getUserFromClient(client) {
    let options = {client_id: client.client_id};
    if (client.client_secret) options.client_secret = client.client_secret;

    return OAuthClient
        .findOne(options)
        .populate('User')
        .then((client) => {
            if (!client) return false;
            if (!client.User) return false;
            return client.User;
        }).catch((err) => {
            console.log("getUserFromClient - Err: ", err)
        });
}

function getRefreshToken(refreshToken) {
    if (!refreshToken || refreshToken === 'undefined') return false;
    return OAuthRefreshToken
        .findOne({refresh_token: refreshToken})
        .populate('User')
        .populate('OAuthClient')
        .then((savedRT) => {
            return {
                user: savedRT ? savedRT.User : {},
                client: savedRT ? savedRT.OAuthClient : {},
                refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
                refreshToken: refreshToken,
                refresh_token: refreshToken,
                scope: savedRT.scope
            };

        }).catch((err) => {
            console.log("getRefreshToken - Err: ", err)
        });
}

function validateScope(token, client, scope) {
    console.log("validateScope", token, client, scope);
    return (user.scope === client.scope) ? scope : false
}

function verifyScope(token, scope) {
    return token.scope === scope
}

module.exports = {
    getAccessToken: getAccessToken,
    getAuthorizationCode: getAuthorizationCode,
    getClient: getClient,
    getRefreshToken: getRefreshToken,
    getUser: getUser,
    getUserFromClient: getUserFromClient,
    revokeAuthorizationCode: revokeAuthorizationCode,
    revokeToken: revokeToken,
    saveToken: saveToken,
    saveAuthorizationCode: saveAuthorizationCode,
    verifyScope: verifyScope
};

