const router = (app) => {
    const router = require('../../Routers/clientRouters/clientRouter')();
    app.use('/client', router);
};
module.exports = router;
