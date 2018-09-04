const asyncWrap = (handler) => {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    }
}

function asyncWrapParam(handler) {
    return function (req, res, next, id) {
        handler(req, res, next, id)
            .catch (next);
    };
}

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = {
    asyncWrap,
    asyncWrapParam,
    createError,
}
