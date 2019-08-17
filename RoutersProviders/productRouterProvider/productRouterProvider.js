const router = (app) => {
    const router = require('../../Routers/productRouters/productRouter')();
    app.use('/product', router);
};
module.exports = router;
