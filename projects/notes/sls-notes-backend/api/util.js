const getResponseHeaders = () => {
    return {
        "Access-Control-Allow-Origin": "*"
    }
};

const getIdToken = (headers) => {
    return headers.Authorization;
}

const getUserId = (headers) => {
    return headers.app_user_id;
};

const getUserName = (headers) => {
    return headers.app_user_name;
};

module.exports = {
    getIdToken,
    getResponseHeaders,
    getUserId,
    getUserName
};