const router = (app) => {
    const router = require('../../Routers/appointmentRouters/appointmentRouter')();
    app.use('/appointment', router);
};
module.exports = router;
