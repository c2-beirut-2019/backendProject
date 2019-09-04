let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        doctorValidator = require('../../Validations/doctorValidator'),
        doctorController = require('../../Controllers/doctorController')(),
        oAuthProvider = require('../../DoctorOAuth/express')(),
        authenticate = require('../../ClientOAuth/authenticate'),
        doctorAuthenticate = require('../../DoctorOAuth/authenticate');

    router.route('/')
        .get(doctorController.getDoctors)
        .post(validate(doctorValidator.addDoctor), doctorController.addDoctor);

    router.route('/:id')
        .put(validate(doctorValidator.updateDoctor), doctorController.updateDoctor)
        .delete(doctorController.deleteDoctor);

    router.route('/code')
        .post(validate(doctorValidator.validateCode), doctorController.validateAccessCode);

    router.route('/username')
        .post(validate(doctorValidator.addUsernameAndPassword), doctorController.addUsernameAndPassword);

    router.route('/schedule')
        .get(validate(doctorValidator.getDoctorSchedule), doctorController.getDoctorsSchedule)
        .post(validate(doctorValidator.addDoctorsSchedule), doctorController.addDoctorsSchedule);

    router.route('/schedule/:id')
        .put(validate(doctorValidator.updateDoctorsSchedule), doctorController.updateDoctorSchedule)
        .delete(doctorController.deleteDoctorSchedule);

    router.route('/authenticate')
        .post(validate(doctorValidator.loginDoctorValidator), oAuthProvider.tokenProvider);

    router.route('/list')
        .get(doctorController.getDoctorsList);

    router.use('/', doctorAuthenticate());

    router.route('/profile')
        .get(doctorController.getDoctorProfile)
        .post(validate(doctorValidator.updateDoctorProfile), doctorController.updateDoctorProfile);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
