/**
 * Route: GET /auth
 */

const jwtDecode = require("jwt-decode");
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });

const util = require("./util.js");

const cognitoIdentity = new AWS.CognitoIdentity();
const identityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;

exports.handler = async (event) => {
    try {
        const idToken = util.getIdToken(event.headers);

        const params = {
            IdentityPoolId: identityPoolId,
            Logins: {
                "account.google.com": idToken
            }
        };
        
        const data = await cognitoIdentity.getId(params).promise();
        
        const loginParams = {
            IdentityId: data.IdentityId,
            Logins: {
                "account.google.com": idToken
            }
        };

        const loginData = await cognitoIdentity.getCredentialsForIdentity(params).promise();

        const decoded = jwtDecode(idToken);
        loginData.user_name = decoded.name;

        return {
            statusCode: 201,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
        }
    } catch (error) {
        console.error("Error", error);
        return {
            statusCode: error.statusCode ?? 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: error.name ?? "Exception",
                message : error.message ?? "Unknown error"
            })
        }
    }
}