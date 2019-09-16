let sectionService = () => {
    let bluebirdPromise = require('bluebird');
    let Section = require('../../Models/CMS/section');
    let async = require('async');

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

    let getSectionsByIds = (sections, query = null) => {
        return new bluebirdPromise((resolve, reject) => {
            if (!query) query = {};
            query['_id'] = {$in: sections};
            Section.find(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }).lean(true);
        });
    };

    let getSections = () => {
        return new bluebirdPromise((resolve, reject) => {
            Section.find({}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let filteredResult = {};
                    for (let item of result) {
                        filteredResult[item._id] = {
                            section_id: item._id,
                            section_name: item.name,
                            link: item.link
                        };

                        if (item.customActions.length > 0) {
                            filteredResult[item._id].customActions = {
                                options: item.customActions,
                                value: []
                            };
                        }
                    }

                    resolve(filteredResult);
                }
            });
        });
    };

    let getSectionAttributes = (section) => {
        return new bluebirdPromise((resolve, reject) => {
            Section.findById(section,{},{lean:true}, (err, sectionResult) => {
                if (err) {
                    reject(err);
                } else if (sectionResult) {
                    if(sectionResult.extraSection && sectionResult.extraSection.length>0){
                        sectionResult.extraTables = [];
                        async.each(sectionResult.extraSection, (section, callback) => {
                            if(section._id && section._id.toString() !== sectionResult._id.toString()){
                                getSectionAttributes(section._id).then((extraTableResult) => {
                                    sectionResult.extraTables.push(extraTableResult);
                                    callback();
                                }).catch((err) => {
                                    reject(err);
                                });
                            } else{
                                callback();
                            }
                        }, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (sectionResult.link === 'profiles') {
                                    getDefaultPermissions().then((defaultPermissionsResult) => {
                                        sectionResult.defaultPermissions = defaultPermissionsResult;
                                        getSectionPermissions().then((sectionPermissions) => {
                                            sectionResult.sectionPermissions = sectionPermissions;
                                            resolve(sectionResult);
                                        }).catch((err) => {
                                            reject(err);
                                        });

                                    }).catch((err) => {
                                        reject(err);
                                    });
                                } else {
                                    resolve(sectionResult);
                                }
                            }
                        });
                    } else{
                        if (sectionResult.link === 'profiles') {
                            getDefaultPermissions().then((defaultPermissionsResult) => {
                                sectionResult.defaultPermissions = defaultPermissionsResult;
                                getSectionPermissions().then((sectionPermissions) => {
                                    sectionResult.sectionPermissions = sectionPermissions;
                                    resolve(sectionResult);
                                }).catch((err) => {
                                    reject(err);
                                });

                            }).catch((err) => {
                                reject(err);
                            });
                        } else {
                            resolve(sectionResult);
                        }
                    }
                } else {
                    resolve({});
                }
            }).populate('extraSection').populate({path: 'backSection', select: 'link'}).lean(true);
        });
    };

    let getDefaultPermissions = () => {
        return new bluebirdPromise((resolve, reject) => {
            Section.find({}, '_id name link defaultPermissions', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let filteredResult = [];
                    result.forEach((section) => {
                        let filteredSection = section.defaultPermissions ? section.defaultPermissions : {};
                        filteredSection.section_id = section._id;
                        filteredSection.section_name = section.name;
                        filteredSection.link = section.link;
                        filteredResult.push(filteredSection);
                    });
                    resolve(filteredResult);
                }
            }).lean(true);
        });
    };

    let getSectionPermissions = () => {
        return new bluebirdPromise((resolve, reject) => {
            Section.find({}, '_id link sectionPermissions', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let filteredResult = {};
                    result.forEach((section) => {
                        filteredResult[section.link] = section.sectionPermissions;
                    });
                    resolve(filteredResult);
                }
            });
        });
    };

    return {
        getSectionsByIds: getSectionsByIds,
        getSections: getSections,
        getSectionAttributes: getSectionAttributes,
        getSectionByLink: getSectionByLink
    }

};
module.exports = sectionService;
