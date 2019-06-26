let express = require('express'),
    healthRouter = express.Router();

healthRouter.route('/').get((req, res) => {
    res.send("Animal House Working");
});


module.exports = healthRouter;
