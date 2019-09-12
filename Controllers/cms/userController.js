let userController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        User = require('../../Models/CMS/user');

    let userMiddleware = (req, res, next) => {
        req.userProfile = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            location: req.user.location,
            phoneNumber: req.user.phoneNumber
        };
        next();
    };

    let getUser = (req, res) => {
        res.send(req.userProfile);
    };

    let updateUser = (req, res) => {
        if (req.body._id)
            delete req.body._id;

        for (let p in req.body)
            req.userProfile[p] = req.body[p];

        req.userProfile._id = req.user._id;
        User.findOneAndUpdate({_id: req.user}, req.profile, function (err, user) {
            if (err)
                res.status(500).send(errorMessagesService.serverError);
            else
                res.send(req.userProfile);
        });
    };

    return {
        userMiddleware: userMiddleware,
        getUser: getUser,
        updateUser: updateUser
    }
};
module.exports = userController;
