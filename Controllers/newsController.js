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

    let updateNews = (req, res) => {
        newsService.updateNews(req.params.id, req.body).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let deleteNews = (req, res) => {
        newsService.deleteNews(req.params.id).then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getNews: getNews,
        addNews: addNews,
        updateNews: updateNews,
        deleteNews: deleteNews
    }
};
module.exports = newsController;
