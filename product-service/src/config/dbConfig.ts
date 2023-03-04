// import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
AWS.config.update({region: 'eu-west-1'});

const createDynamoDBClient = new AWS.DynamoDB.DocumentClient();;

export default createDynamoDBClient;