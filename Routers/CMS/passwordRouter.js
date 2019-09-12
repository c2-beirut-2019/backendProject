let forgetPasswordRouter = (User, UserResetPassword) => {
    let express = require('express'),
        validate = require('express-validation'),
        passwordController = require('../../Controllers/CMS/passwordController')(User,UserResetPassword),
        globalController = require('../../Controllers/globalController')(),
        userPasswordValidator = require('../../Validations/CMS/userPasswordValidator'),
        forgetPasswordRouter = express.Router();

    forgetPasswordRouter.route('/forgot')
        .put(validate(userPasswordValidator.forgotPasswordValidator), passwordController.generateForgetPassword);

    forgetPasswordRouter.route('/reset')
        .put(validate(userPasswordValidator.resetPasswordValidator), passwordController.resetPassword);

    forgetPasswordRouter.use(globalController.validationMiddleware);

    return forgetPasswordRouter;
};
module.exports = forgetPasswordRouter;
