import { Handler, S3EventRecord } from 'aws-lambda';
import { S3Client, GetObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import csv from 'csv-parser';
import { Readable } from 'stream';
import logger from '@libs/logger';

export const importFileParser: Handler = async event => {
  logger('importFileParser', event);

  const record = event?.Records?.find((r: S3EventRecord) => r.eventName === 'ObjectCreated:Put');
  if (!record) {
    return event;
  }

  const sqsClient = new SQSClient({ region: "eu-west-1" });
  const queue: Array<Record<string, string>> = [];

  const Bucket = record.s3.bucket.name;
  const Key = record.s3.object.key;

  const client = new S3Client({ region: "eu-west-1" });
  const getCommand = new GetObjectCommand({ Bucket, Key });

  const response = await client.send(getCommand);
  if (!response?.Body) {
    return event;
  }

  let product = null;

  await new Promise<void>((resolve, reject) => {
    (response.Body as Readable)
      .pipe(csv({ strict: true }))
      .on('data', async data => {
        product = data;
        queue.push(data);
      })
      .on('error', reject)
      .on('end', () => {
        console.log('file parsing is finished');
        resolve();
      });
  });

  await Promise.all(
    queue.map(async data => {
      console.log('Start sending the message...');
      console.log(data);
      try {
        await sqsClient.send(
          new SendMessageCommand({ QueueUrl: process.env.SQS_URL, MessageBody: JSON.stringify(data) })
        );
        console.log('The message was sent');
      } catch (e) {
        console.log(e);
      }
    })
  );
  
  const copyCommand = new CopyObjectCommand({
    CopySource: `${Bucket}/${Key}`,
    Bucket,
    Key: Key.replace(/^uploaded/, 'parsed')
  });

  await client.send(copyCommand);

  return event;
};