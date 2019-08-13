let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        appointmentValidator = require('../../Validations/apointmentValidator'),
        appointmentController = require('../../Controllers/appointmentController')(),
        authenticate = require('../../ClientOAuth/authenticate');

    router.use('/', authenticate());
    router.route('/')
        .post(validate(appointmentValidator.addAppointment), appointmentController.addAppointment);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
