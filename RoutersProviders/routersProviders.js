let routersProviders = (app) => {
    require('./newsRouterProvider/newsRouterProvider')(app);
    require('./clientRouterProvider/clientRouterProvider')(app);
    require('./doctorRouterProvider/doctorRouterProvider')(app);
    require('./animalCategoryRouterProvider/animalCategoryRouterProvider')(app);
    require('./animalSpecieRouterProvider/animalSpecieRouterProvider')(app);
    require('./petRouterProvider/petRouterProvider')(app);

    let healthRoute = require('../healthRoutes/healthRouter');
    let ipRoute = require('../healthRoutes/ip');
    app.use('/health', healthRoute);
    app.use('/ip', ipRoute);
};
module.exports = routersProviders;
