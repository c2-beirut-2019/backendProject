let globalController = function () {
    let messageService = require('../Services/messagesService');

    let validationMiddleware = (err, req, res, next) => {
        if (err) {
            let error = messageService.bad_request;
            error.errors = err.errors;
            res.status(400).send(error);
        }
    };
    return {
        validationMiddleware: validationMiddleware
    }
};
module.exports = globalController;
