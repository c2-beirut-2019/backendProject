let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        doctorValidator = require('../../Validations/doctorValidator'),
        doctorController = require('../../Controllers/doctorController')(),
        oAuthProvider = require('../../DoctorOAuth/express')(),
        authenticate = require('../../ClientOAuth/authenticate');

    router.route('/')
        .get(doctorController.getDoctors)
        .post(validate(doctorValidator.addDoctor), doctorController.addDoctor);

    router.route('/code')
        .post(validate(doctorValidator.validateCode), doctorController.validateAccessCode);

    router.route('/username')
        .post(validate(doctorValidator.addUsernameAndPassword), doctorController.addUsernameAndPassword);

    router.route('/authenticate')
        .post(validate(doctorValidator.loginDoctorValidator), oAuthProvider.tokenProvider);

    router.use('/', authenticate());

    router.route('/list')
        .get(doctorController.getDoctorsList);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
