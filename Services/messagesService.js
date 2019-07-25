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
    }
};
