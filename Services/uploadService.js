const uploadService = () => {
    const blueBirdPromise = require('bluebird'),
        randomString = require('randomstring'),
        AWS = require('aws-sdk'),
        fileType = require('file-type'),
        config = require('../config');

    const uploadFile = (file) => {
        return new blueBirdPromise((resolve, reject) => {
            AWS.config.update({
                accessKeyId: config.awsConfig.accessKeyId,
                secretAccessKey: config.awsConfig.secretAccessKey
            });
            let s3 = new AWS.S3({
                region: config.awsConfig.region
            });
            const bitmap = new Buffer(file.data, 'base64');
            const extension = fileType(bitmap);
            const key = randomString.generate({length: 5, charset: 'alphabetic'});
            const fileName = file.name + '_' + new Date().getTime() + '_' + key + '.' + file.extension;
            let awsOptions = {
                Bucket: config.awsConfig.bucket,
                Key: config.awsConfig.AWS_LINK + fileName,
                Body: bitmap,
                ContentEncoding: 'base64',
                ContentType: extension.mime,
                ACL: config.awsConfig.ACL
            };
            s3.putObject(awsOptions, (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    let link = config.awsConfig.LINK + config.awsConfig.AWS_LINK + fileName;
                    resolve(link);
                }
            });
        });
    };

    // const deleteFile = (fileName) => {
    //   return new blueBirdPromise((resolve, reject) => {
    //     let s3 = new AWS.S3({
    //       region: config.awsConfig.region
    //     });
    //     let awsOptions = {
    //       Bucket: config.awsConfig.bucket,
    //       Key: fileName,
    //     };
    //     s3.deleteObject(awsOptions, (err, resp) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve();
    //       }
    //     });
    //   });
    // };

    return {
        uploadFile: uploadFile
    };
};
module.exports = uploadService;
