const AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const userId = event.pathParameters.userid;
    
    const data = await dynamodb.get({
        TableName: tableName,
        Key: {
            userId
        }
    }).promise();
    
    if(data.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        }
    } else {
        throw new Error("User not found");
    }
}