let sectionRouter = () => {
    let express = require('express'),
        validate = require('express-validation'),
        sectionValidator = require('../../Validations/CMS/sectionValidator'),
        globalController = require('../../Controllers/globalController')(),
        sectionController = require('../../Controllers/CMS/sectionController')(),
        sectionRouter = express.Router(),
        authenticate = require('../../CMSUsersOauth/authenticate');

    sectionRouter.use('/', authenticate());
    sectionRouter.route('/')
        .get(sectionController.getSections)
        .post(validate(sectionValidator.addSection), sectionController.addSection)
        .put(validate(sectionValidator.updateSection), sectionController.updateSection);

    sectionRouter.route('/:id')
        .delete(validate(sectionValidator.deleteSection), sectionController.deleteSection);

    sectionRouter.route('/:link')
        .get(validate(sectionValidator.getSectionAttributes), sectionController.getSectionAttributes);

    sectionRouter.route('/permissions')
        .put(validate(sectionValidator.updateSectionPermissions), sectionController.updateSectionPermissions);

    sectionRouter.route('/defaultPermissions')
        .put(validate(sectionValidator.updateSectionDefaultPermissions), sectionController.updateSectionDefaultPermissions);

    sectionRouter.use(globalController.validationMiddleware);
    return sectionRouter;
};
module.exports = sectionRouter;
