/**
 * Route: GET /note/n/{note_id}
 */

const _ = require("underscore");
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require("./util.js");

exports.handler = async (event) => {
    try {
        const noteId = decodeURIComponent(event.pathParameters.note_id);

        const params = {
            TableName: tableName,
            IndexName: "note_id-index",
            KeyConditionExpression: "note_id = :note_id",
            ExpressionAttributeValues: {
                ":note_id": noteId
            },
            Limit: 1
        };

        const data = await dynamodb.query(params).promise();
        if(!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            }
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders(),
            }
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