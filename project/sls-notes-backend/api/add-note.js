/**
 * Route: POST /note
 */

const moment = require("moment");
const uuidv4 = require("uuid/v4");
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
        item.node_id = item.user_id + ":" + uuidv4();
        item.timestamp = moment().unix();
        item.expires = moment().add(90, "days").unix();

        const data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 201,
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