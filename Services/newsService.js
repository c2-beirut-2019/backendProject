let newsService = () => {
    let blueBirdPromise = require('bluebird');
    let News = require('../Models/News');

    let getNews = () => {
        return new blueBirdPromise((resolve, reject) => {
            resolve('test');
        });
    };

    return {
        getNews: getNews
    }
};
module.exports = newsService;
