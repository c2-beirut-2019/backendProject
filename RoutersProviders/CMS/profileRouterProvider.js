let routers = (app) => {
    let profileRouter = require('../../Routers/CMS/profileRouter')();

    app.use('/profile', profileRouter);
};
module.exports = routers;
