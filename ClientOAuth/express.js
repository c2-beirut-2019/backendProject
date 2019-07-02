let oAuthController = function () {
    const oauthServer = require('oauth2-server'),
        Request = oauthServer.Request,
        Response = oauthServer.Response,
        mongoose = require('mongoose'),
        userModel = require('../Models/User'),
        clientModel = require('./mongodb/OAuthClient'),
        errorMessagesService = require('../Services/messagesService');

    let oauth = require('./oauth');

    let tokenProvider = (req, res, next) => {
        if (req.body.grant_type === 'refresh_token') {
            let request = new Request(req);
            let response = new Response(res);

            oauth.token(request, response)
                .then((token) => {
                    console.log(token);
                    let auth = {
                        access_token: 'Bearer ' + token.accessToken,
                        expires_in: Math.abs(parseInt(((token.accessTokenExpiresAt - new Date()) / 1000).toFixed(0))),
                        refresh_token: token.refreshToken
                    };
                    res.send(auth);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(401).json(errorMessagesService.unAuthorized);
                })
        }
        else {
            userModel.findOne({username: req.body.username, password: req.body.password}, (err, user) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (user) {
                        clientModel.findOne({User: mongoose.Types.ObjectId(user._id)}, (err, client) => {
                            let basicAuth = client.client_id + ':' + client.client_secret;
                            let buffer = new Buffer(basicAuth);
                            let basicAuthBase64 = buffer.toString('base64');
                            req.headers['Authorization'] = 'Basic ' + basicAuthBase64;
                            let request = new Request(req);
                            let response = new Response(res);

                            oauth.token(request, response)
                                .then((token) => {
                                    let auth = createTokenResponse(user, token, basicAuthBase64);
                                    userModel.findOneAndUpdate({_id: user._id}, {
                                        $set: {
                                            lastLoginDate: new Date()
                                        }
                                    }).exec();
                                    res.send(auth);
                                })
                                .catch((err) => {
                                    res.status(401).json(errorMessagesService.unAuthorized);
                                });
                        });
                    } else {
                        res.status(401).send(errorMessagesService.unAuthorized);
                    }
                }
            });
        }
    };

    function createTokenResponse(user, token, basicAuthBase64) {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            _id: user._id,
            access_token: 'Bearer ' + token.accessToken,
            expires_in: Math.abs(parseInt(((token.accessTokenExpiresAt - new Date()) / 1000).toFixed(0))),
            refresh_token: token.refreshToken,
            refresh_token_header: 'Basic ' + basicAuthBase64
        }
    }

    return {
        tokenProvider: tokenProvider

    }
};
module.exports = oAuthController;
