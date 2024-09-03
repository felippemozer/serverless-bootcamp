const AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const userId = event.pathParameters.userid;
    const {firstName, lastName, email, website} = JSON.parse(event.body);

    await dynamodb.put({
        TableName: tableName,
        Item: {
            userId,
            firstName,
            lastName,
            email,
            website
        }
    }).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Data inserted"
        })
    }
}