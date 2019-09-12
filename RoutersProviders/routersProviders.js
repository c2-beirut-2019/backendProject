let routersProviders = (app) => {
    require('./newsRouterProvider/newsRouterProvider')(app);
    require('./clientRouterProvider/clientRouterProvider')(app);
    require('./doctorRouterProvider/doctorRouterProvider')(app);
    require('./animalCategoryRouterProvider/animalCategoryRouterProvider')(app);
    require('./animalSpecieRouterProvider/animalSpecieRouterProvider')(app);
    require('./petRouterProvider/petRouterProvider')(app);
    require('./appointmentTypeRouterProvider/appointmentTypeRouterProvider')(app);
    require('./appointmentRouterProvider/appointmentRouterProvider')(app);
    require('./productRouterProvider/productRouterProvider')(app);
    require('./CMS/usersRouterProvider')(app);
    require('./CMS/profileRouterProvider')(app);
    require('./CMS/userRouterProvider')(app);
    require('./CMS/sectionRouterProvider')(app);

    let healthRoute = require('../healthRoutes/healthRouter');
    let ipRoute = require('../healthRoutes/ip');
    app.use('/health', healthRoute);
    app.use('/ip', ipRoute);
};
module.exports = routersProviders;
