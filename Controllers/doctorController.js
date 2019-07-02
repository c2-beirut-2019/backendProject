let Controller = () => {
    let messagesService = require('../Services/messagesService');
    let doctorOauth = require('../DoctorOAuth/addDoctor')();

    let addDoctor = (req, res) => {
        doctorOauth.createDoctorAndAccessCode(req.body).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let validateAccessCode = (req, res) => {
        doctorOauth.validateDoctorAccessCode(req.body.accessCode).then((result) => {
            res.status(200).send();
        }).catch((err) => {
            res.status(500).send(messagesService.serverError);
        });
    };

    let addUsernameAndPassword = (req, res) => {
        doctorOauth.addUsernameAndPassword(req.body.accessCode, req.body.username, req.body.password).then(() => {
            res.status(200).send();
        }).catch((err) => {
            if (err === 'invalidAccessCode') {
                res.status(460).send(messagesService.invalidAccessCode);
            } else if (err === 'exists') {
                res.status(500).send(messagesService.usernameExists);
            } else {
                res.status(500).send(messagesService.serverError);
            }
        });
    };

    return {
        addDoctor: addDoctor,
        validateAccessCode: validateAccessCode,
        addUsernameAndPassword: addUsernameAndPassword
    }
};
module.exports = Controller;
