const AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const userId = event.pathParameters.userid;

    await dynamodb.delete({
        TableName: tableName,
        Key: {
            userId
        }
    }).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "User deleted"
        })
    }
}