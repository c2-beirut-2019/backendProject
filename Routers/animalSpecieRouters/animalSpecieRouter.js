let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        animalSpecieValidator = require('../../Validations/animalSpecieValidator'),
        animalSpecieController = require('../../Controllers/animalSpecieController')();

    router.route('/')
        .get(animalSpecieController.getAnimalSpecies)
        .post(validate(animalSpecieValidator.addAnimalSpecie), animalSpecieController.addAnimalSpecie);

    router.route('/:id')
        .delete(animalSpecieController.deleteAnimalSpecie);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
