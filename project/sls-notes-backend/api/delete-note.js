/**
 * Route: DELETE /note/t/{timestamp}
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require("./util.js");

exports.handler = async (event) => {
    try {
        const timestamp = decodeURIComponent(event.pathParameters.timestamp);
        const params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(event.headers),
                timestamp: timestamp
            }
        };

        await dynamodb.delete(params).promise();
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
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