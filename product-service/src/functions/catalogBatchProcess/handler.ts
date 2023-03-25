import { SQSHandler, SQSRecord } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuidv4 } from 'uuid';
import logger from '@libs/logger';
import Product from 'src/model/Product';
import Stock from 'src/model/Stock';

const catalogBatchProcess: SQSHandler = async event => {
  logger('catalogBatchProcess', event);

  const client = new DynamoDBClient({ region: process.env.REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  const createProduct = async (r: SQSRecord): Promise<Product> => {
    const parsed = JSON.parse(r.body);
    const { title, description, price, count } = parsed.data;

    if (!title || !description || !price || !count) {
      throw new Error('missed required data');
    }
    const id = uuidv4();
    const product: Omit<Product, 'count'> = { id, title, description, price };
    const stock: Stock = { product_id: id, count };

    const createProduct = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: "products",
            Item: product
          }
        },
        {
          Put: {
            TableName: "stocks",
            Item: stock
          }
        }
      ]
    });
    await ddbDocClient.send(createProduct);
    return { id, title, description, price, count };
  };

  const results = await Promise.all(event.Records?.map(createProduct));
  console.log(results);
  console.log('Products created');

  const params = {
    Message: JSON.stringify({ products: results }),
    Subject: 'New Products',
    TopicArn: process.env.TOPIC_ARN
  };
  const snsClient = new SNSClient({ region: process.env.REGION });
  await snsClient.send(new PublishCommand(params));
  console.log('Notification sent');
};

export const main = catalogBatchProcess;