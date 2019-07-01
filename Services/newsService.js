let newsService = () => {
    let blueBirdPromise = require('bluebird');
    let News = require('../Models/News');
    let paginateService = require('../Services/paginateService')(News);

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
            let news = new News(body);
            news.creationDate = new Date();
            news.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        });
    };

    return {
        getNews: getNews,
        addNews: addNews
    }
};
module.exports = newsService;
