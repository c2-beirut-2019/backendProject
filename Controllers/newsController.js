let newsController = () => {
    let newsService = require('../Services/newsService')();
    let messagesService = require('../Services/messagesService');

    let getNews = (req, res) => {
        newsService.getNews().then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    return {
        getNews: getNews
    }
};
module.exports = newsController;
