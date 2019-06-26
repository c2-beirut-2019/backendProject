const router = (app) => {
    const router = require('../../Routers/newsRouters/newsRouter')();
    app.use('/news', router);
};
module.exports = router;
