/**
 * Route: PATCH /note/{id}
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require("./util.js");

exports.handler = async (event) => {
    try {
        const item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.expires = moment().add(90, "days").unix();

        const data = await dynamodb.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: "#t = :t",
            ExpressionAttributeNames: {
                "#t": "timestamp",
            },
            ExpressionAttributeValues: {
                ":t": item.timestamp
            }
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
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