const router = (app) => {
    const router = require('../../Routers/doctorRouters/doctorRouter')();
    app.use('/doctor', router);
};
module.exports = router;
