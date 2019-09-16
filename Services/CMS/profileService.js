let profileService = () => {
    let bluebirdPromise = require('bluebird'),
        Profile = require('../../Models/CMS/profile'),
        Section = require('../../Models/CMS/section'),
        paginateService = require('../paginateService')(Profile),
        sectionService = require('.//sectionService')(Section),
        async = require('async'),
        User = require('../../Models/CMS/user');

    let filterGetProfiles = (profiles) => {
        return new bluebirdPromise((resolve, reject) => {
            sectionService.getSections().then((sectionsResult) => {

                sectionsResult = JSON.stringify(sectionsResult);
                async.each(profiles, (profile, callback) => {
                    let initialSections = JSON.parse(sectionsResult);
                    let permissions = [];

                    for (let sectionIndex in initialSections) {
                        if (sectionIndex in profile.permissions) {
                            for (let actionIndex in profile.permissions[sectionIndex]) {
                                if (actionIndex === 'customActions') {
                                    if ('options' in initialSections[sectionIndex][actionIndex]) {
                                        initialSections[sectionIndex][actionIndex].options.forEach((option) => {
                                            option.value = option.permission;
                                        });
                                    }

                                    initialSections[sectionIndex][actionIndex].value = Object.keys(profile.permissions[sectionIndex][actionIndex]);
                                } else {
                                    initialSections[sectionIndex][actionIndex] = profile.permissions[sectionIndex][actionIndex];
                                }
                            }
                        }
                        permissions.push(initialSections[sectionIndex]);
                    }
                    profile.permissions = permissions;
                    callback();
                }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(profiles);
                    }
                });

            }).catch((err) => {
                reject(err);
            });
        });
    };

    let getProfiles = (query, page, limit, sort) => {
        return new bluebirdPromise((resolve, reject) => {
            paginateService.getCMSData(query, page, limit, sort).then((result) => {
                filterGetProfiles(result.data).then((filteredResult) => {
                    result.data = filteredResult;
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    };

    let getProfilesList = () => {
        return new bluebirdPromise((resolve, reject) => {
            Profile.find({}, '_id name', (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let filteredResult = [];
                    for (let item of result) {
                        filteredResult.push({
                            text: item.name,
                            value: item._id
                        });
                    }
                    resolve(filteredResult);
                }
            });
        });
    };

    let requestPermission = (req) => {
        return new bluebirdPromise((resolve, reject) => {
            const apiBaseUrl = req.baseUrl.startsWith('/') ? req.baseUrl.substring(1) : req.baseUrl;
            Section.findOne({url: apiBaseUrl}, (err, section) => {
                if (err || !section) {
                    reject(err);
                } else {
                    const profilesIds = req.user.profiles;
                    let query = {
                        _id: {$in: profilesIds}
                    };
                    query['permissions.' + section._id] = {$exists: true};
                    Profile.find(query, 'permissions', (err, profiles) => {
                        if (err || !profiles || profiles.length === 0) {
                            reject(err);
                        } else {
                            concatPermissions(profiles).then((permissions) => {
                                const sectionPermissions = permissions[section._id];
                                let index;
                                switch (req.method) {
                                    case 'POST':
                                        index = 'canAdd';
                                        break;
                                    case 'PUT':
                                        index = 'canUpdate';
                                        break;
                                    case 'DELETE':
                                        index = 'canDelete';
                                        break;
                                    default:
                                        index = 'canRead';
                                        break;
                                }
                                sectionPermissions[index] ? resolve() : reject();
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                    });
                }
            });
        });
    };

    let concatPermissions = (profiles) => {
        return new bluebirdPromise((resolve) => {
            let filteredPermissions = {};
            for (let profile of profiles) {
                for (let section in profile.permissions) {
                    if (!('customActions' in profile.permissions[section])) {
                        profile.permissions[section].customActions = {};
                    }
                    if (profile.permissions.hasOwnProperty(section)) {
                        const sectionPermissions = profile.permissions[section];
                        if (sectionPermissions.canRead || sectionPermissions.canAdd || sectionPermissions.canUpdate ||
                            sectionPermissions.canDelete || sectionPermissions.customActions) {
                            if (!(section in filteredPermissions)) {
                                filteredPermissions[section] = sectionPermissions;
                            } else {
                                for (let similarPermission in filteredPermissions[section]) {
                                    if (filteredPermissions[section].hasOwnProperty(similarPermission)) {
                                        if (similarPermission !== 'customActions') {
                                            if (filteredPermissions[section][similarPermission] || sectionPermissions[similarPermission]) {
                                                filteredPermissions[section][similarPermission] = true;
                                            }
                                        } else {
                                            let customActions = {};
                                            for (let action in filteredPermissions[section][similarPermission]) {
                                                if (!(action in customActions)) {
                                                    customActions[action] = true;
                                                }
                                            }
                                            for (let action in sectionPermissions[similarPermission]) {
                                                if (!(action in customActions)) {
                                                    customActions[action] = true;
                                                }
                                            }
                                            filteredPermissions[section][similarPermission] = customActions;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            resolve(filteredPermissions);
        });
    };

    let getPermissionsByProfiles = (profilesIds) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {_id: {$in: profilesIds}};
            Profile.find(query, 'permissions', (err, profiles) => {
                if (err) {
                    reject(err);
                } else {
                    concatPermissions(profiles).then((permissions) => {
                        const sectionIds = Object.keys(permissions);
                        const query = {};
                        sectionService.getSectionsByIds(sectionIds, query).then((sections) => {
                            let sectionsCheck = {};
                            for (let item of sections) {
                                item = Object.assign(item, permissions[item._id]);
                                item.icon_name = item.icon;
                                delete item.icon;
                                item.section_id = item._id;
                                delete item._id;
                                item.section_name = item.name;
                                delete item.name;
                                item.tab_abrev = item.link;
                                delete item.attributes;
                                delete item.defaultPermissions;
                                delete item.sectionPermissions;

                                if (Object.keys(item.customActions).length === 0) {
                                    delete item.customActions;
                                }

                                if (!item.isParent) {
                                    sectionsCheck[item.link] = item;
                                } else {
                                    if (!sectionsCheck[item.parent.link]) {
                                        let itemParent = {
                                            isParent: true,
                                            link: item.parent.link,
                                            section_name: item.parent.name,
                                            icon_name: item.parent.icon,
                                            children: []
                                        };
                                        delete item.parent;
                                        delete item.isParent;
                                        itemParent.children.push(item);
                                        sectionsCheck[itemParent.link] = itemParent;
                                    } else {
                                        let parentLink = item.parent.link;
                                        delete item.parent;
                                        delete item.isParent;
                                        sectionsCheck[parentLink].children.push(item);
                                    }
                                }
                            }
                            let newSections = [];
                            for (let key in sectionsCheck) {
                                newSections.push(sectionsCheck[key]);
                            }
                            resolve(newSections);

                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    };

    let addProfile = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            Profile.find({name: data.name}, (err, result) => {
                if (err) {
                    reject(err);
                } else if (result && result.length > 0) {
                    reject('exists');
                } else {
                    // Filtering customActions permissions into a valid profile Schema
                    for (let section in data.permissions) {
                        if ('customActions' in data.permissions[section]) {
                            let customActions = {};
                            for (let index in data.permissions[section].customActions) {
                                customActions[data.permissions[section].customActions[index]] = true;
                            }
                            data.permissions[section].customActions = customActions;

                        }
                    }

                    paginateService.addData(data).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    };

    let updateProfile = (data) => {
        return new bluebirdPromise((resolve, reject) => {
            Profile.findOne({name: data.name}, (err, result) => {
                if (err) {
                    reject(err);
                } else if (!result || result._id.toString() === data._id) {
                    if (result && result._id.toString() === data._id) {
                        delete data.name;
                    }

                    const id = data._id;
                    delete data._id;

                    // Filtering customActions permissions into a valid profile Schema
                    for (let section in data.permissions) {
                        if ('customActions' in data.permissions[section]) {
                            let customActions = {};
                            for (let index in data.permissions[section].customActions) {
                                customActions[data.permissions[section].customActions[index]] = true;
                            }
                            data.permissions[section].customActions = customActions;
                        }
                    }

                    Profile.findByIdAndUpdate(id, data, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    reject('exists');
                }
            });
        });
    };

    let getCustomProfiles = (profiles) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: {$in: profiles},
                default: {$ne: true}
            };
            Profile.distinct('_id', query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    let removeUsersProfiles = (profile) => {
        return new bluebirdPromise((resolve, reject) => {
            User.update({}, {$pull: {profiles: profile}}, {multi: true}, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    let deleteProfile = (req) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: req.params.id,
                default: false
            };

            Profile.findOneAndRemove(query, (err, result) => {
                if (err) {
                    reject(err);
                } else if (result) {
                    removeUsersProfiles(result._id).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                } else {
                    resolve();
                }
            });
        });
    };

    let getSectionPermissionByProfiles = (section, profiles) => {
        return new bluebirdPromise((resolve, reject) => {
            let query = {
                _id: {$in: profiles}
            };
            query['permissions.' + section] = {$exists: true};
            Profile.find(query, 'permissions', (err, profiles) => {
                if (err) {
                    reject(err);
                } else if (!profiles || profiles.length === 0) {
                    resolve({canRead: false, canAdd: false, canUpdate: false, canDelete: false, canExport: false});
                } else {
                    concatPermissions(profiles).then((permissions) => {
                        const sectionPermissions = permissions[section];
                        resolve(sectionPermissions);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    };

    return {
        getProfiles: getProfiles,
        addProfile: addProfile,
        updateProfile: updateProfile,
        deleteProfile: deleteProfile,
        getPermissionsByProfiles: getPermissionsByProfiles,
        getProfilesList: getProfilesList,
        requestPermission: requestPermission,
        getSectionPermissionByProfiles: getSectionPermissionByProfiles
    }
};
module.exports = profileService;
