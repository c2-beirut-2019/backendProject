let profileController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        profileService = require('../../Services/CMS/profileService')();

    let getProfiles = (req, res) => {
        let query = {};
        if (req.query.search && req.query.search.length > 0 && req.query.searchFields && req.query.searchFields.length > 0) {
            let searchFields = req.query.searchFields.split(',');

            req.query.search = decodeURIComponent(req.query.search);
            query['$or'] = [];
            for (let index in searchFields) {
                let fieldQuery = {};
                if (searchFields[index] === 'name') {
                    fieldQuery[searchFields[index]] = {$regex: req.query.search, $options: "i"};
                    query['$or'].push(fieldQuery);
                }
            }
        }

        profileService.getProfiles(query, req.query.page, req.query.limit, {default: 1, name: 1}).then((result) => {
            res.send(result);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let getProfilesList = (req, res) => {
        profileService.getProfilesList(req.body).then((result) => {
            res.send(result);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let addProfile = (req, res) => {
        profileService.addProfile(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch((err) => {
            if (err && (err.code === 11000 || err === 'exists')) {
                res.status(400).send(errorMessagesService.nameExists);
            } else {
                res.status(500).send(errorMessagesService.serverError);
            }
        });
    };

    let updateProfile = (req, res) => {
        profileService.updateProfile(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch((err) => {
            if (err && err === 'exists') {
                res.status(400).send(errorMessagesService.nameExists);
            } else {
                res.status(500).send(errorMessagesService.serverError);
            }
        });
    };

    let deleteProfile = (req, res) => {
        profileService.deleteProfile(req).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    return {
        getProfiles: getProfiles,
        getProfilesList: getProfilesList,
        addProfile: addProfile,
        updateProfile: updateProfile,
        deleteProfile: deleteProfile
    };
};
module.exports = profileController;
