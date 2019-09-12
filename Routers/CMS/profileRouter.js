let profileRouter = () => {
    let express = require('express'),
        validate = require('express-validation'),
        profileValidator = require('../../Validations/CMS/profileValidator'),
        globalController = require('../../Controllers/globalController')(),
        profileController = require('../../Controllers/CMS/profileController')(),
        profileRouter = express.Router(),
        authenticate = require('../../CMSUsersOauth/authenticate'),
        permissionController = require('../../Controllers/CMS/permissionController')();

    profileRouter.use('/', authenticate());
    // profileRouter.use(permissionController.permissionMiddleware);
    profileRouter.route('/')
        .get(profileController.getProfiles)
        .post(validate(profileValidator.addProfileValidator), profileController.addProfile)
        .put(validate(profileValidator.updateProfileValidator), profileController.updateProfile);

    profileRouter.route('/:id')
        .delete(validate(profileValidator.deleteProfileValidator), profileController.deleteProfile);

    profileRouter.route('/list')
        .get(profileController.getProfilesList);

    profileRouter.use(globalController.validationMiddleware);

    return profileRouter;
};
module.exports = profileRouter;
