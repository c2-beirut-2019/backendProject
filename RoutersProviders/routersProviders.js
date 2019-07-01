let routersProviders = (app) => {
    require('./newsRouterProvider/newsRouterProvider')(app);
    require('./clientRouterProvider/clientRouterProvider')(app);

    let healthRoute = require('../healthRoutes/healthRouter');
    let ipRoute = require('../healthRoutes/ip');
    app.use('/health', healthRoute);
    app.use('/ip', ipRoute);
};
module.exports = routersProviders;
