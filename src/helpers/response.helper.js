const successResponse = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        error: undefined
    });
};

const warningResponse = (res, message, statusCode = 400, data = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data,
        error: undefined
    });
};

const errorResponse = (res, message, error = null, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data,
        error: error ? error : undefined
    });
};

module.exports = {
    successResponse,
    warningResponse,
    errorResponse
}