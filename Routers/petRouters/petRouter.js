let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        petValidator = require('../../Validations/petValidator'),
        petController = require('../../Controllers/petController')();

    router.route('/toAdopt')
        .get(petController.getPetsToAdopt)
        .post(validate(petValidator.addPetToAdopt), petController.addPetToAdopt);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
