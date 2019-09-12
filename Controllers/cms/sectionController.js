let sectionController = () => {
    let errorMessagesService = require('../../Services/messagesService'),
        sectionService = require('../../Services/CMS/sectionService')(),
        SectionServices = require('../../Services/CMS/sectionsServices')(),
        ProfileService = require('../../Services/CMS/profileService')();

    let getSectionAttributes = (req, res) => {
        sectionService.getSectionByLink(req.params.link).then((sectionResult) => {
            ProfileService.getSectionPermissionByProfiles(sectionResult._id, req.user.profiles).then((sectionPermission) => {
                sectionService.getSectionAttributes(sectionResult._id).then((result) => {

                    result.permissions = sectionPermission;
                    res.send(result);

                }).catch(() => {
                    res.status(500).send(errorMessagesService.serverError);
                });
            }).catch(() => {
                res.status(500).send(errorMessagesService.serverError);
            });
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let getSections = (req, res) => {
        SectionServices.getSections({}, req.query.page, req.query.limit).then((result) => {
            res.send(result);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let addSection = (req, res) => {
        if (req.body.extraSection === '') {
            delete req.body.extraSection;
        }
        SectionServices.addSection(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch((err) => {
            if (err && err === 'linkExists') {
                res.status(400).send(errorMessagesService.linkExists);
            } else if (err && err === 'urlExists') {
                res.status(400).send(errorMessagesService.urlExists);
            } else {
                res.status(500).send(errorMessagesService.serverError);
            }
        });
    };

    let updateSection = (req, res) => {
        if (req.body.extraSection === '') {
            delete req.body.extraSection;
        }
        SectionServices.updateSection(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch((err) => {
            if (err && err === 'linkExists') {
                res.status(400).send(errorMessagesService.linkExists);
            } else if (err && err === 'urlExists') {
                res.status(400).send(errorMessagesService.urlExists);
            } else {
                res.status(500).send(errorMessagesService.serverError);
            }
        });
    };

    let deleteSection = (req, res) => {
        SectionServices.deleteSection(req.params.id).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let updateSectionPermissions = (req, res) => {
        SectionServices.updateSectionPermissions(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    let updateSectionDefaultPermissions = (req, res) => {
        SectionServices.updateSectionDefaultPermissions(req.body).then(() => {
            res.send(errorMessagesService.updated);
        }).catch(() => {
            res.status(500).send(errorMessagesService.serverError);
        });
    };

    return {
        getSectionAttributes: getSectionAttributes,
        getSections: getSections,
        addSection: addSection,
        updateSection: updateSection,
        deleteSection: deleteSection,
        updateSectionPermissions: updateSectionPermissions,
        updateSectionDefaultPermissions: updateSectionDefaultPermissions
    }
};
module.exports = sectionController;
