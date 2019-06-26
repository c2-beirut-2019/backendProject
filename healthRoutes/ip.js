let express = require('express');
let router = express.Router();
let ip = require("ip");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(ip.address());
});

module.exports = router;
