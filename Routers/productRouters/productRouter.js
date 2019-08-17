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

    router.route('/:id')
        .put(validate(productValidator.updateProduct), productController.updateProduct)
        .delete(productController.deleteProduct);

    router.use(globalController.validationMiddleware);

    return router;
};
module.exports = router;
