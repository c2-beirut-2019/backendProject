module.exports = {
    serverError: {
        error: true,
        status: 500,
        error_code: "Internal_server_error",
        message: "Some errors occurred, please try again later",
        key: 'server_error'
    },
    not_found: {
        error: true,
        status: 404,
        error_code: "Not_found",
        message: "Not found",
        key: 'not_found'
    },
    bad_request: {
        error: true,
        status: 400,
        error_code: "Bad_request",
        message: "Invalid request parameters/Bad request."
    },
    noRestFound: {
        error: true,
        status: 500,
        error_code: "No_rest_found",
        message: 'No REST found for your request.'
    },
    unAuthorized: {
        error: true,
        status: 401,
        error_code: "UnAuthorized",
        message: "UnAuthorized"
    },
    invalidAccessCode: {
        error: true,
        status: 460,
        error_code: "InvalidAccessCode",
        message: "Invalid Access Code"
    },
    usernameExists: {
        error: true,
        status: 460,
        error_code: "usernameExists",
        message: "Username exists"
    },
    userInactive: {
        error: true,
        status: 403,
        error_code: "userInactive",
        message: "User Inactive"
    },
    scheduleAlreadyExists: {
        error: true,
        status: 460,
        error_code: "scheduleAlreadyExists",
        message: "This day already exists in the doctor's schedule"
    },
    appointmentExists: {
        error: true,
        status: 460,
        error_code: "appointmentExists",
        message: "This doctor already has an appointment by that time"
    },
    doctorNotAvailable: {
        error: true,
        status: 460,
        error_code: "doctorNotAvailable",
        message: "This doctor is not available by that time"
    },
    cannotDeleteCategory: {
        error: true,
        status: 460,
        error_code: "cannotDeleteCategory",
        message: "You cannot delete this category because of species attached to it"
    },
    cannotDeleteSpecie: {
        error: true,
        status: 460,
        error_code: "cannotDeleteSpecie",
        message: "You cannot delete this specie because of pets attached to it"
    },
    cannotDeleteType: {
        error: true,
        status: 460,
        error_code: "cannotDeleteType",
        message: "You cannot delete this type because of appointments attached to it"
    },
    cannotDeleteClientPet: {
        error: true,
        status: 460,
        error_code: "cannotDeleteClientPet",
        message: "You cannot delete this pet because of future appointments attached to it"
    },
    cannotUpdateClientPet: {
        error: true,
        status: 460,
        error_code: "cannotUpdateClientPet",
        message: "You cannot update the owner of the pet because of future appointments attached to it"
    },
    cannotDeleteUser: {
        error: true,
        status: 460,
        error_code: "cannotDeleteUser",
        message: "You cannot delete this user because of pets attached to it"
    },
    cannotDeleteDoctor: {
        error: true,
        status: 460,
        error_code: "cannotDeleteDoctor",
        message: "You cannot delete this doctor because of future appointments attached to it"
    },
    cannotUpdateAppointment: {
        error: true,
        status: 460,
        error_code: "cannotUpdateAppointment",
        message: "You cannot update a confirmed appointment"
    },
    cannotDeleteAppointment: {
        error: true,
        status: 460,
        error_code: "cannotDeleteAppointment",
        message: "You cannot delete a confirmed appointment"
    },
    updated: {
        error: false,
        message: 'Successfully Updated'
    },
    userExists: {
        error: true,
        status: 400,
        error_code: "userExists",
        message: 'Email Already Exists'
    },
    nameExists: {
        error: true,
        status: 400,
        error_code: "nameExists",
        message: 'Name Already Exists'
    },
    wrongCredentials: {
        error: true,
        status: 400,
        error_code: "wrongCredentials",
        message: 'Wrong Credentials'
    },
    passwordTokenExpired: {
        error: true,
        status: 400,
        error_code: "passwordTokenExpired",
        message: 'Token Expired'
    },
    passwordTokenInvalid: {
        error: true,
        status: 400,
        error_code: "passwordTokenInvalid",
        message: 'Invalid Token'
    },
    linkExists: {
        error: true,
        status: 400,
        error_code: "linkExists",
        message: 'Link Already Exists'
    },
    urlExists: {
        error: true,
        status: 400,
        error_code: "urlExists",
        message: 'URL Already Exists'
    },
};
