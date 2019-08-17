let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        appointmentTypeValidator = require('../../Validations/apointmentTypeValidator'),
        appointmentTypeController = require('../../Controllers/appointmentTypeController')();

    router.route('/')
        .get(appointmentTypeController.getAppointmentTypes)
        .post(validate(appointmentTypeValidator.addAppointmentType), appointmentTypeController.addAppointmentTypes);

    router.route('/:id')
        .put(validate(appointmentTypeValidator.updateAppointmentType), appointmentTypeController.updateAppointmentTypes)
        .delete(appointmentTypeController.deleteAppointmentTypes);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
