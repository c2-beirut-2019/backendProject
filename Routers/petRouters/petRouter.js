let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        petValidator = require('../../Validations/petValidator'),
        petController = require('../../Controllers/petController')(),
        authenticate = require('../../ClientOAuth/authenticate');

    router.route('/')
        .get(petController.getClientPets)
        .post(validate(petValidator.addClientPet), petController.addClientPet);

    router.route('/toAdopt')
        .get(petController.getPetsToAdopt)
        .post(validate(petValidator.addPetToAdopt), petController.addPetToAdopt);

    router.use('/', authenticate());

    router.route('/client')
        .get(petController.getLoginUserPets);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
