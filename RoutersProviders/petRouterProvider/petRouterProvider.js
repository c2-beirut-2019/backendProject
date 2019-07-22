const router = (app) => {
    const router = require('../../Routers/petRouters/petRouter')();
    app.use('/pet', router);
};
module.exports = router;
