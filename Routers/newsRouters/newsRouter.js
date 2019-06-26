let router = () => {
    let express = require('express'),
        validate = require('express-validation'),
        router = express.Router(),
        globalController = require('../../Controllers/globalController')(),
        newsValidator = require('../../Validations/newsValidator'),
        newsController = require('../../Controllers/newsController')();

    router.route('/')
        .get(newsController.getNews);

    router.use(globalController.validationMiddleware);
    return router;
};
module.exports = router;
