let Service = () => {
    let blueBirdPromise = require('bluebird');
    let async = require('async');
    let Product = require('../Models/Product');
    let paginateService = require('./paginateService')(Product);
    let uploadService = require('./uploadService')();

    let getProducts = (query, page, limit, sortBy, sortOrder, search, priceFrom, priceTo, color) => {
        return new blueBirdPromise((resolve, reject) => {
                if (priceFrom || priceTo) {
                    query = {$and: []};
                    if (priceFrom) {
                        query.$and.push({price: {$gte: parseFloat(priceFrom)}});
                    }
                    if (priceTo) {
                        query.$and.push({price: {$lte: parseFloat(priceTo)}});
                    }
                    // if (color) {
                    //     query.$and.push({colorsAvailable: color});
                    // }
                }
                // else {
                //     if (color) {
                //         query = {'colorsAvailable.$': color};
                //     }
                // }
                let aggregation = [
                    {$match: query},
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            price: 1,
                            quantityAvailable: 1,
                            colorsAvailable: 1,
                            colors: '$colorsAvailable',
                            createDate: 1,
                            images: 1
                        }
                    },
                    {$unwind: "$colors"}
                ];
                if (color) {
                    aggregation.push({$match: {colors: {$regex: color, $options: "i"}}})
                }
                aggregation.push({
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        price: 1,
                        quantityAvailable: 1,
                        colorsAvailable: 1,
                        createDate: 1,
                        images: 1
                    }
                });
                if (page) {
                    if (!sortBy) {
                        sortBy = 'createDate';
                        sortOrder = 'desc'
                    }
                    let searchFor = ['title', 'description'];
                    let searchFields = 'title,description';
                    paginateService.getAggregationData(aggregation, {
                        pageIndex: page,
                        limit: limit,
                        sortBy: sortBy,
                        sortOrder: sortOrder,
                        search: search,
                        searchFields: searchFields
                    }, null, searchFor).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    })
                } else {
                    Product.find({}).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            }
        );
    };

    let addProduct = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            let newProduct = {
                title: body.title,
                description: body.description,
                price: body.price,
                quantityAvailable: body.quantityAvailable,
                colorsAvailable: body.colorsAvailable,
                images: [],
                createDate: new Date()
            };
            if (body.images && body.images.length > 0) {
                let linkImages = [];
                async.each(body.images, (image, callback) => {
                    uploadService.uploadFile(image).then((link) => {
                        linkImages.push(link);
                        callback();
                    }).catch((err) => {
                        reject(err);
                    })
                }, (err) => {
                    if (err) {
                        reject();
                    } else {
                        newProduct.images = linkImages;
                        let record = new Product(newProduct);
                        record.save(function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve()
                            }
                        })
                    }
                });
            } else {
                let record = new Product(newProduct);
                record.save(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                })
            }
        });
    };

    let updateProduct = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            if (body.images && body.images.length > 0) {
                let linkImages = [];
                async.each(body.images, (image, callback) => {
                    if (typeof (image) !== 'string') {
                        console.log('in if');
                        uploadService.uploadFile(image).then((link) => {
                            linkImages.push(link);
                            callback();
                        }).catch((err) => {
                            reject(err);
                        })
                    } else {
                        linkImages.push(image);
                        callback();
                    }
                }, (err) => {
                    if (err) {
                        reject();
                    } else {
                        body.images = linkImages;
                        Product.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            } else {
                Product.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    };

    let deleteProduct = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            Product.findOneAndRemove({_id: id}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    return {
        getProducts: getProducts,
        addProduct: addProduct,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct
    }
};
module.exports = Service;
