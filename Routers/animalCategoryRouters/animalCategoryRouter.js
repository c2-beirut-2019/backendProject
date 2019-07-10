let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        animalCategoryValidator = require('../../Validations/animalCategoryValidator'),
        animalCategoryController = require('../../Controllers/animalCategoryController')();

    router.route('/')
        .get(animalCategoryController.getAnimalCategory)
        .post(validate(animalCategoryValidator.addAnimalCategory), animalCategoryController.addAnimalCategory);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
