const router = (app) => {
    const router = require('../../Routers/animalCategoryRouters/animalCategoryRouter')();
    app.use('/animalCategory', router);
};
module.exports = router;
