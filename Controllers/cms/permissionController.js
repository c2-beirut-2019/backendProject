let permissionController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        profileService = require('../../Services/CMS/profileService')();

    let permissionMiddleware = (req, res, next) => {
        profileService.requestPermission(req).then(() => {
            next();
        }).catch(() => {
            res.status(401).send(errorMessagesService.unAuthorized);
        });
    };

    return {
        permissionMiddleware: permissionMiddleware
    }
};
module.exports = permissionController;
