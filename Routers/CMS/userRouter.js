let userRouter = () => {
    let express = require('express'),
        validate = require('express-validation'),
        userAuthenticationValidator = require('../../Validations/CMS/userAuthenticationValidator'),
        userRequestValidator = require('../../Validations/CMS/userRequestValidator'),
        userPasswordValidator = require('../../Validations/CMS/userPasswordValidator'),
        globalController = require('../../Controllers/globalController')(),
        userController = require('../../Controllers/CMS/userController')(),
        passwordController = require('../../Controllers/CMS/passwordController')(),
        userRouter = express.Router(),
        oAuthProvider = require('../../CMSUsersOauth/express')(),
        authenticate = require('../../CMSUsersOauth/authenticate');

    userRouter.route('/authenticate')
        .post(validate(userAuthenticationValidator.loginUserValidator), oAuthProvider.tokenProvider);

    userRouter.route('/sendResetOtp')
        .put(validate(userPasswordValidator.forgotPasswordValidator), passwordController.generateForgetPassword);

    userRouter.route('/checkPasswordToken/:id')
        .get(passwordController.checkToken);

    userRouter.route('/resetPassword')
        .put(validate(userPasswordValidator.resetPasswordValidator), passwordController.resetPassword);

    userRouter.use('/', authenticate());
    userRouter.use('/', userController.userMiddleware);

    userRouter.route('/')
        .get(userController.getUser)
        .put(validate(userRequestValidator.updateUserValidator), userController.updateUser);

    userRouter.route('/password/change')
        .put(validate(userPasswordValidator.changePasswordValidator), passwordController.changePassword);

    userRouter.route('/logout')
        .put(oAuthProvider.logoutUser);

    userRouter.use(globalController.validationMiddleware);

    return userRouter;
};
module.exports = userRouter;
