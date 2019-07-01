let newsController = () => {
    let newsService = require('../Services/newsService')();
    let messagesService = require('../Services/messagesService');

    let getNews = (req, res) => {
        newsService.getNews({}, req.query.page, req.query.limit, {creationDate: -1}).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addNews = (req, res) => {
        newsService.addNews(req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getNews: getNews,
        addNews: addNews
    }
};
module.exports = newsController;
