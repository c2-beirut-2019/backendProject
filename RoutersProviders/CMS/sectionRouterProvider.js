let routers = (app) => {
    let router = require('../../Routers/CMS/sectionRouter')();

    app.use('/section', router);
};
module.exports = routers;
