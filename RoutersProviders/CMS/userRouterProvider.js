let routers = (app) => {
    let userRouter = require('../../Routers/CMS/userRouter')();

    app.use('/user', userRouter);
};
module.exports = routers;
