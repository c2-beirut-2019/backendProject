const router = (app) => {
    const router = require('../../Routers/appointmentTypeRouters/appointmentTypeRouter')();
    app.use('/appointmentType', router);
};
module.exports = router;
