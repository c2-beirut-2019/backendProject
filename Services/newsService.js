let newsService = () => {
    let blueBirdPromise = require('bluebird');
    let News = require('../Models/News');
    let paginateService = require('../Services/paginateService')(News);
    let uploadService = require('../Services/uploadService')();

    let getNews = (query, page, limit, sort) => {
        return new blueBirdPromise((resolve, reject) => {
            if (page) {
                paginateService.getData(query, {
                    pageIndex: page,
                    limit: limit,
                    sortBy: 'creationDate',
                    sortOrder: 'desc'
                }).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            } else {
                News.find({}).sort({creationDate: -1}).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    };

    let addNews = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            if (body.image) {
                uploadService.uploadFile(body.image).then((link) => {
                    body.image = link;
                    let news = new News(body);
                    news.creationDate = new Date();
                    news.save(function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve()
                        }
                    })
                }).catch((err) => {
                    reject(err);
                })
            } else {
                let news = new News(body);
                news.creationDate = new Date();
                news.save(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve()
                    }
                })
            }
        });
    };

    let updateNews = (id, body) => {
        return new blueBirdPromise((resolve, reject) => {
            if (body.image) {
                uploadService.uploadFile(body.image).then((link) => {
                    body.image = link;
                    News.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }).catch((err) => {
                    reject(err);
                })
            } else {
                News.findOneAndUpdate({_id: id}, {$set: body}, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            }
        });
    };

    let deleteNews = (id) => {
        return new blueBirdPromise((resolve, reject) => {
            News.findOneAndRemove({_id: id}, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

    return {
        getNews: getNews,
        addNews: addNews,
        updateNews: updateNews,
        deleteNews: deleteNews
    }
};
module.exports = newsService;
