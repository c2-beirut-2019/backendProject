let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        productValidator = require('../../Validations/productValidator'),
        productController = require('../../Controllers/productController')();

    router.route('/')
        .get(productController.getProducts)
        .post(validate(productValidator.addProduct), productController.addProduct);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
