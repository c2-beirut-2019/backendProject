const router = (app) => {
    const router = require('../../Routers/animalSpecieRouters/animalSpecieRouter')();
    app.use('/animalSpecie', router);
};
module.exports = router;
