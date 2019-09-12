let routers = (app) => {
    let userRouter = require('../../Routers/CMS/usersRouter')();
    app.use('/users', userRouter);
};
module.exports = routers;
