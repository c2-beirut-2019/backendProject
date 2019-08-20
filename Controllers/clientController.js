let Controller = () => {
    let messagesService = require('../Services/messagesService');
    let userService = require('../Services/userService')();
    let clientOauth = require('../ClientOAuth/addUser')();

    let addClient = (req, res) => {
        clientOauth.createClientAndAccessCode(req.body).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let validateAccessCode = (req, res) => {
        clientOauth.validateClientAccessCode(req.body.accessCode).then((result) => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addUsernameAndPassword = (req, res) => {
        clientOauth.addUsernameAndPassword(req.body.accessCode, req.body.username, req.body.password).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'invalidAccessCode') {
                res.status(460).send(messagesService.invalidAccessCode);
            } else if (err === 'exists') {
                res.status(500).send(messagesService.usernameExists);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    let getUsers = (req, res) => {
        userService.getUsers().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let getUserProfile = (req, res) => {
        userService.getUserProfile(req.user._id).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let updateUserProfile = (req, res) => {
        userService.updateUserProfile(req.user._id, req.body).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('err', err);
            res.status(500).send(messagesService.serverError);
        });
    };

    let updateUser = (req, res) => {
        userService.updateUser(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let deleteUser = (req, res) => {
        userService.deleteUser(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'cannotDeleteUser') {
                res.status(460).send(messagesService.cannotDeleteUser);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };


    return {
        addClient: addClient,
        getUsers: getUsers,
        validateAccessCode: validateAccessCode,
        addUsernameAndPassword: addUsernameAndPassword,
        getUserProfile: getUserProfile,
        updateUserProfile: updateUserProfile,
        updateUser: updateUser,
        deleteUser: deleteUser
    }
};
module.exports = Controller;
