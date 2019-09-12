let usersController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        usersService = require('../../Services/cms/usersService')();

    let getUsers = (req, res) => {
        let query = {};
        if (req.query.search && req.query.search.length > 0 && req.query.searchFields && req.query.searchFields.length > 0) {
            let searchFields = req.query.searchFields.split(',');

            req.query.search = decodeURIComponent(req.query.search);
            query['$or'] = [];
            for (let index in searchFields) {
                let fieldQuery = {};
                if (searchFields[index] === 'firstName' || searchFields[index] === 'lastName' || searchFields[index] === 'email') {
                    fieldQuery[searchFields[index]] = {$regex: req.query.search, $options: "i"};
                    query['$or'].push(fieldQuery);
                }
            }
        }

        usersService.getUsers(query, req.query.page, req.query.limit, {
            default: 1,
            active: -1,
            name: 1
        }).then((result) => {
            res.send(result);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let addUser = (req, res) => {
        usersService.addUser(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch((err) => {
            if (err && err.code === 11000) {
                res.status(400).send(errorMessagesService.userExists);
            } else {
                res.status(500).send(errorMessagesService.serverError);
            }
        });
    };

    let updateUser = (req, res) => {
        usersService.updateUser(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let deactivateUsers = (req, res) => {
        usersService.deactivateUsers(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let activateUsers = (req, res) => {
        usersService.activateUsers(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    return {
        getUsers: getUsers,
        addUser: addUser,
        updateUser: updateUser,
        deactivateUsers: deactivateUsers,
        activateUsers: activateUsers
    };
};
module.exports = usersController;
