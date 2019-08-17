let Controller = () => {
    let productService = require('../Services/productService')();
    let messagesService = require('../Services/messagesService');

    let getProducts = (req, res) => {
        productService.getProducts({}, req.query.page, req.query.limit, req.query.sortBy, req.query.sortOrder,
            req.query.search, req.query.priceFrom, req.query.priceTo, req.query.color).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('errr', err);
            res.status(500).send(messagesService.serverError);
        });
    };

    let addProduct = (req, res) => {
        productService.addProduct(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getProducts: getProducts,
        addProduct: addProduct
    }
};
module.exports = Controller;
