let usersRouter = () => {
    let express = require('express'),
        validate = require('express-validation'),
        usersValidator = require('../../Validations/CMS/usersValidator'),
        globalController = require('../../Controllers/globalController')(),
        usersController = require('../../Controllers/CMS/usersController')(),
        usersRouter = express.Router(),
        authenticate = require('../../CMSUsersOauth/authenticate'),
        permissionController = require('../../Controllers/CMS/permissionController')();

    usersRouter.use('/', authenticate());

    usersRouter.route('/activate')
        .put(validate(usersValidator.deactivateUsersValidator), usersController.activateUsers);

    usersRouter.route('/deactivate')
        .put(validate(usersValidator.deactivateUsersValidator), usersController.deactivateUsers);

    // usersRouter.use(permissionController.permissionMiddleware);
    usersRouter.route('/')
        .get(usersController.getUsers)
        .post(validate(usersValidator.addUserValidator), usersController.addUser)
        .put(validate(usersValidator.updateUserValidator), usersController.updateUser);

    usersRouter.use(globalController.validationMiddleware);

    return usersRouter;
};
module.exports = usersRouter;

