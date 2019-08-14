let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        appointmentValidator = require('../../Validations/apointmentValidator'),
        appointmentController = require('../../Controllers/appointmentController')(),
        authenticate = require('../../ClientOAuth/authenticate'),
        doctorAuthenticate = require('../../DoctorOAuth/authenticate');

    router.route('/all')
        .get(appointmentController.getAllAppointments);

    router.use('/doctorAppointment', doctorAuthenticate());
    router.route('/doctorAppointment')
        .get(appointmentController.getDoctorsAppointment);

    router.use('/', authenticate());
    router.route('/')
        .get(appointmentController.getAppointments)
        .post(validate(appointmentValidator.addAppointment), appointmentController.addAppointment);

    router.route('/userAppointment')
        .get(appointmentController.getUserAppointment);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
