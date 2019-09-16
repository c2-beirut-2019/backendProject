let Joi = require('joi');
Joi.objectID = require('joi-objectid')(Joi);
let sectionValidator = {
    getSectionAttributes: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        params: {
            link: Joi.string().required()
        }
    },
    addSection: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            menuHidden: Joi.boolean().required(),
            isParent: Joi.boolean().optional(),
            parent: Joi.object({
                link: Joi.string().required(),
                name: Joi.string().required(),
                icon: Joi.string().required(),
            }).optional(),
            customActions:Joi.array().min(1).items(Joi.object({
                id: Joi.string().required(),
                label: Joi.string().required(),
                name: Joi.string().required(),
                url: Joi.string().required(),
                method: Joi.string().required(),
                permission: Joi.string().required(),
                sentence: Joi.string().required(),
                allowNoneSelection: Joi.string().optional(),
                type: Joi.string().optional(),
                form: Joi.object({}).optional(),
            })).optional(),
            name: Joi.string().required(),
            icon: Joi.string().required(),
            link: Joi.string().required(),
            url: Joi.string().required(),
            extraSection: Joi.objectID().allow('').optional(),
            tableName: Joi.string().required(),
            sortBy: Joi.string().allow('').required(),
            allowSearch: Joi.boolean().required(),
            get_url: Joi.string().required(),
            add_url: Joi.string().required(),
            save_url: Joi.string().required(),
            delete_url: Joi.string().required(),
            delete_sentence: Joi.string().required(),
            backIcon: Joi.boolean().required(),
            allowPagination: Joi.boolean().required(),
            show_only_form: Joi.boolean().required(),
            param_id: Joi.string().allow(''),
            get_column_identifier: Joi.string().allow(''),
            get_from_table: Joi.boolean().optional(),
            required: Joi.boolean().optional(),
            saveParamSeparated: Joi.boolean().optional(),
        }
    },
    updateSection: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            _id: Joi.objectID().required(),
            menuHidden: Joi.boolean().required(),
            isParent: Joi.boolean().optional(),
            parent: Joi.object({
                link: Joi.string().required(),
                name: Joi.string().required(),
                icon: Joi.string().required(),
            }).optional(),
            customActions:Joi.array().min(1).items(Joi.object({
                id: Joi.string().required(),
                label: Joi.string().required(),
                name: Joi.string().required(),
                url: Joi.string().required(),
                method: Joi.string().required(),
                permission: Joi.string().required(),
                sentence: Joi.string().required(),
                allowNoneSelection: Joi.string().optional(),
                type: Joi.string().optional(),
                form: Joi.object({}).optional(),
            })).optional(),
            name: Joi.string().required(),
            icon: Joi.string().required(),
            link: Joi.string().required(),
            url: Joi.string().required(),
            extraSection: Joi.objectID().allow('').optional(),
            tableName: Joi.string().required(),
            sortBy: Joi.string().allow('').required(),
            allowSearch: Joi.boolean().required(),
            get_url: Joi.string().required(),
            add_url: Joi.string().required(),
            save_url: Joi.string().required(),
            delete_url: Joi.string().required(),
            delete_sentence: Joi.string().required(),
            backIcon: Joi.boolean().required(),
            allowPagination: Joi.boolean().required(),
            show_only_form: Joi.boolean().required(),
            param_id: Joi.string().allow(''),
            get_column_identifier: Joi.string().allow(''),
            get_from_table: Joi.boolean().optional(),
            required: Joi.boolean().optional(),
            saveParamSeparated: Joi.boolean().optional(),
        }
    },
    deleteSection: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        params: {
            id: Joi.objectID().required()
        }
    },
    updateSectionPermissions: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            _id: Joi.objectID().required(),
            canRead: Joi.string().required(),
            canAdd: Joi.string().required(),
            canUpdate: Joi.string().required(),
            canDelete: Joi.string().required(),
            canExport: Joi.string().required()
        }
    },
    updateSectionDefaultPermissions: {
        options: {
            allowUnknownBody: false,
            status: 400
        },
        body: {
            _id: Joi.objectID().required(),
            canRead: Joi.boolean().required(),
            canAdd: Joi.boolean().required(),
            canUpdate: Joi.boolean().required(),
            canDelete: Joi.boolean().required(),
            canExport: Joi.boolean().required()
        }
    },
};
module.exports = sectionValidator;
