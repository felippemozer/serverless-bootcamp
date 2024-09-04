/**
 * Route: GET /notes
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require("./util.js");

exports.handler = async (event) => {
    try {
        const query = event.queryStringParameters;
        const limit = query && query.limit ? parseInt(query.limit) : 5;
        const userId = util.getUserId(event.headers);

        const params = {
            TableName: tableName,
            KeyConditionExpression: "user_id = :uid",
            ExpressionAttributeValues: {
                ":uid": userId
            },
            Limit: limit,
            ScanIndexForward: false
        };

        const startTimestamp = query && query.start ? parseInt(query.start) : 0;

        if(startTimestamp > 0) {
            params.ExclusiveStartKey = {
                user_id: userId,
                timestamp: startTimestamp
            }
        }

        const data = await dynamodb.query(params).promise();

        return {
            statusCode: 200,
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