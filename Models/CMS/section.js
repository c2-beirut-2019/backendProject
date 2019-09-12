let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate');

let sectionModel = new Schema({
    name: String,
    icon: String,
    isParent: {
        type: Boolean,
        default: false
    },
    parent: {
        link: String,
        name: String,
        icon: String
    },
    menuHidden: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        unique: true
    },
    url: {
        type: String,
        unique: true
    },
    extraSection: [{
        type: Schema.Types.ObjectId,
        ref: 'CMSSection'
    }],
    tableName: String,
    sortBy: String,
    allowSearch: {
        type: Boolean,
        default: true
    },
    show_only_form: {
        type: Boolean,
        default: false
    },
    get_url: String,
    add_url: String,
    save_url: String,
    delete_url: String,
    delete_sentence: String,
    backIcon: {
        type: Boolean,
        default: false
    },
    backSection: {
        type: Schema.Types.ObjectId,
        ref: 'CMSSection'
    },
    allowPagination: {
        type: Boolean,
        default: true
    },
    customActions: [
        {
            id: {
                type: String,
                unique: true
            },
            label: String,
            name: String,
            url: String,
            method: String,
            permission: String,
            sentence: String,
            allowNoneSelection:{
                type:Boolean,
                default:false
            },
            action_type:String,
            form:{
                button:{},
                formFields:[]
            }
        }
    ],
    manageFields: [
        {
            label: String,
            link: {
                type: String,
                unique: true
            }
        }
    ],
    extraData: [
        {
            data_id: String,
            url: String,
            text_label: String,
            value_label: String,
            text_to_display: String,
            value_label_to_display: String
        }
    ],
    sectionPermissions: {
        canRead: {
            type: String,
            default: 'false'
        },
        canAdd: {
            type: String,
            default: 'false'
        },
        canUpdate: {
            type: String,
            default: 'false'
        },
        canDelete: {
            type: String,
            default: 'false'
        },
        canExport: {
            type: String,
            default: 'false'
        }
    },
    defaultPermissions: {
        canRead: {
            type: Boolean,
            default: false
        },
        canAdd: {
            type: Boolean,
            default: false
        },
        canUpdate: {
            type: Boolean,
            default: false
        },
        canDelete: {
            type: Boolean,
            default: false
        },
        canExport: {
            type: Boolean,
            default: false
        }
    },
    fields: [
        {
            type: {
                type: String
            },
            identifier: {
                type: String,
                default: true
            },
            label: String,
            readonly: {
                type: Boolean,
                default: false
            },
            table_hidden: {
                type: Boolean,
                default: false
            },
            order: Number,
            validation: String,
            options_url: String,
            required: {
                type: Boolean,
                default: false
            },
            sortable: {
                type: Boolean,
                default: false
            },
            allowSearch: {
                type: Boolean,
                default: false
            },
            add_hidden: {
                type: Boolean,
                default: false
            },
            form_hidden: {
                type: Boolean,
                default: false
            }
        }
    ],
    get_column_identifier: String,
    get_from_table: {
        type: Boolean,
        default: false
    },
    required:{
        type: Boolean,
        default: false
    },
    saveParamSeparated:{
        type: Boolean,
        default: false
    },
    param_id: String,
    __v: {type: Number, select: false}
});
sectionModel.plugin(mongoosePaginate);
module.exports = mongoose.model('CMSSection', sectionModel);
