let sectionServices = () => {
    let bluebirdPromise = require('bluebird'),
        Section = require('../../Models/CMS/section'),
        paginateService = require('../paginateService')();

    let getSectionByLink = (link) => {
        return new bluebirdPromise((resolve, reject) => {
            Section.findOne({link: link}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let getSectionByUrl = (url) => {
        return new bluebirdPromise((resolve, reject) => {
            Section.findOne({url: url}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let getSections = (query, page, limit, sort) => {
        return new bluebirdPromise((resolve, reject) => {
            paginateService.getData(query, page, limit, sort).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let addSection = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            getSectionByLink(data.link).then((result) => {
                if (result) {
                    reject('linkExists');
                } else {
                    getSectionByUrl(data.url).then((result) => {
                        if (result) {
                            reject('urlExists');
                        } else {
                            data.attributes = {
                                tableName: data.name
                            };

                            const newSection = new Section(data);
                            newSection.save((err) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(true);
                            });
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let updateSection = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            getSectionByLink(data.link).then((result) => {
                if (result && result._id.toString() !== data._id) {
                    reject('linkExists');
                } else {
                    getSectionByUrl(data.url).then((result) => {
                        if (result && result._id.toString() !== data._id) {
                            reject('urlExists');
                        } else {
                            const id = data._id;
                            delete data._id;

                            data.attributes = {
                                tableName: data.name
                            };

                            Section.findByIdAndUpdate(id, {$set: data}, () => {
                                resolve(true);
                            }).catch((err) => {
                                reject(err);
                            })
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let deleteSection = (section) => {
        return new bluebirdPromise((resolve, reject) => {
            Section.findByIdAndDelete(section).then(() => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let updateSectionPermissions = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            const id = data._id;
            delete data._id;

            const update = {$set: {sectionPermissions: data}};
            Section.findByIdAndUpdate(id, update, () => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let updateSectionDefaultPermissions = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            const id = data._id;
            delete data._id;

            const update = {$set: {defaultPermissions: data}};
            Section.findByIdAndUpdate(id, update, () => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    return {
        getSections: getSections,
        addSection: addSection,
        updateSection: updateSection,
        deleteSection: deleteSection,
        updateSectionPermissions: updateSectionPermissions,
        updateSectionDefaultPermissions: updateSectionDefaultPermissions
    }
};
module.exports = sectionServices;
