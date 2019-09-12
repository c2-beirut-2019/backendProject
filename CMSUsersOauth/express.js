let oAuthController = function () {
    let oauthServer = require('oauth2-server'),
        Request = oauthServer.Request,
        Response = oauthServer.Response,
        mongoose = require('mongoose'),
        userModel = require('../Models/CMS/user'),
        clientModel = require('./mongodb/OAuthClient'),
        oAuthAccessTokenModel = require('./mongodb/OAuthAccessToken'),
        oAuthRefreshTokenModel = require('./mongodb/OAuthRefreshToken'),
        errorMessagesService = require('../Services/messagesService'),
        randomString = require('randomstring'),
        bluebirdPromise = require('bluebird');

    let profileModel = require('../Models/CMS/profile'),
        sectionModel = require('../Models/CMS/section'),
        profileService = require('../Services/CMS/profileService')(profileModel, sectionModel);

    let oauth = require('./oauth');

    let tokenProvider = (req, res, next) => {
        if (req.body.grant_type === 'refresh_token') {
            let request = new Request(req);
            let response = new Response(res);

            oauth.token(request, response)
                .then((token) => {
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
        } else {
            userModel.findOne({email: req.body.email, password: req.body.password}, (err, user) => {
                if (err) {
                    res.status(400).send(err);
                }
                if (user /*&& user.profiles.length > 0*/) {

                    clientModel.findOne({User: mongoose.Types.ObjectId(user._id)}, (err, client) => {
                        let basicAuth = client.client_id + ':' + client.client_secret;
                        let buffer = new Buffer(basicAuth);
                        let basicAuthBase64 = buffer.toString('base64');
                        req.headers['Authorization'] = 'Basic ' + basicAuthBase64;
                        req.body.username = req.body.email;
                        delete req.body.email;
                        let request = new Request(req);
                        let response = new Response(res);

                        oauth.token(request, response)
                            .then((token) => {
                                let auth = createTokenResponse(user, token, basicAuthBase64);
                                userModel.findOneAndUpdate({_id: user._id}, {
                                    $set: {
                                        lastLogin: new Date()
                                    }
                                }).exec();

                                profileService.getPermissionsByProfiles(user.profiles).then((permissions) => {
                                    if (permissions && permissions.length > 0) {
                                        auth.sidemenu = permissions;
                                        res.send(auth);
                                    } else {
                                        res.status(401).send(errorMessagesService.unAuthorized);
                                    }
                                }).catch(() => {
                                    res.status(401).send(errorMessagesService.unAuthorized);
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(401).json(errorMessagesService.unAuthorized);
                            })
                    });

                } else {
                    res.status(401).send(errorMessagesService.unAuthorized);
                }
            });
        }
    };

    let addUser = (req, res) => {
        let user = new userModel(req.body);
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    res.status(409).send(errorMessagesService.userExists)
                } else {
                    res.status(500).send(errorMessagesService.serverError);
                }
            } else {
                let oauthClient = {
                    client_id: user.email,
                    client_secret: randomString.generate(10),
                    User: user._id
                };
                let client = new clientModel(oauthClient);
                client.save((err) => {
                    if (err)
                        res.status(500).send(errorMessagesService.serverError);
                    else {
                        delete req.body;
                        req.body = {
                            username: user.email,
                            password: user.password,
                            grant_type: 'password'
                        };
                        let basicAuth = oauthClient.client_id + ':' + oauthClient.client_secret;
                        let buffer = new Buffer(basicAuth);
                        let basicAuthBase64 = buffer.toString('base64');
                        req.headers['Authorization'] = 'Basic ' + basicAuthBase64;
                        let request = new Request(req);
                        let response = new Response(res);
                        oauth.token(request, response)
                            .then((token) => {
                                let auth = createTokenResponse(user, token, basicAuthBase64);
                                res.status(201).send(auth);
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(401).json(errorMessagesService.unAuthorized);
                            })
                    }
                })
            }
        })
    };

    let addUserOAuthClient = (user, email) => {
        return new bluebirdPromise((resolve, reject) => {
            clientModel.findOne({User: mongoose.Types.ObjectId(user)}, (err, client) => {
                if (err) {
                    reject(err);
                } else if (client) {
                    resolve();
                } else {
                    let oauthClient = {
                        client_id: email,
                        client_secret: randomString.generate(10),
                        User: user
                    };
                    let client = new clientModel(oauthClient);
                    client.save((err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    };

    let removeUserOAuthTokens = (user) => {
        return new bluebirdPromise((resolve, reject) => {
            oAuthRefreshTokenModel.remove({User: mongoose.Types.ObjectId(user)}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    oAuthAccessTokenModel.remove({User: mongoose.Types.ObjectId(user)}, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    };

    let removeUsersOAuthTokens = (users) => {
        return new bluebirdPromise((resolve, reject) => {

            oAuthRefreshTokenModel.remove({User: {$in: users}}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    oAuthAccessTokenModel.remove({User: {$in: users}}, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    };

    let logoutUser = (req, res) => {
        removeUserOAuthTokens(req.user._id).then(() => {
            res.send(errorMessagesService.userLogout)
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    function createTokenResponse(user, token, basicAuthBase64) {
        return {
            fullName: user.fullName,
            username: user.username,
            emailVerified: user.emailVerified,
            access_token: 'Bearer ' + token.accessToken,
            expires_in: Math.abs(parseInt(((token.accessTokenExpiresAt - new Date()) / 1000).toFixed(0))),
            refresh_token: token.refreshToken,
            refresh_token_header: 'Basic ' + basicAuthBase64
        }
    }

    return {
        tokenProvider: tokenProvider,
        addUser: addUser,
        logoutUser: logoutUser,
        removeUsersOAuthTokens: removeUsersOAuthTokens,
        addUserOAuthClient: addUserOAuthClient

    }
};
module.exports = oAuthController;
