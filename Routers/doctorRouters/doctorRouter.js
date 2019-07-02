let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        doctorValidator = require('../../Validations/doctorValidator'),
        doctorController = require('../../Controllers/doctorController')();

    router.route('/')
        .post(validate(doctorValidator.addDoctor), doctorController.addDoctor);

    router.route('/code')
        .post(validate(doctorValidator.validateCode), doctorController.validateAccessCode);

    router.route('/username')
        .post(validate(doctorValidator.addUsernameAndPassword), doctorController.addUsernameAndPassword);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
