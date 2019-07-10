let Service = () => {
    let blueBirdPromise = require('bluebird');
    let AnimalCategory = require('../Models/AnimalCategory');

    let getAnimalCategories = () => {
        return new blueBirdPromise((resolve, reject) => {
            AnimalCategory.find({}).sort({name: 1}).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            })
        });
    };

    let addAnimalCategory = (body) => {
        return new blueBirdPromise((resolve, reject) => {
            let record = new AnimalCategory(body);
            record.save(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        });
    };

    return {
        getAnimalCategories: getAnimalCategories,
        addAnimalCategory: addAnimalCategory
    }
};
module.exports = Service;
