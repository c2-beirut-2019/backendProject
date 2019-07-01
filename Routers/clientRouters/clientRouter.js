let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        clientValidator = require('../../Validations/clientValidator'),
        clientController = require('../../Controllers/clientController')();

    router.route('/')
        .post(validate(clientValidator.addClient), clientController.addClient);

    router.route('/code')
        .post(validate(clientValidator.validateCode), clientController.validateAccessCode);

    router.route('/username')
        .post(validate(clientValidator.addUsernameAndPassword), clientController.addUsernameAndPassword);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
