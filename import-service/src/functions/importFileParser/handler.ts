import { Handler, S3EventRecord } from 'aws-lambda';
import { S3Client, GetObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { Readable } from 'stream';
import logger from '@libs/logger';

export const importFileParser: Handler = async event => {
  logger('importFileParser', event);

  const record = event?.Records?.find((r: S3EventRecord) => r.eventName === 'ObjectCreated:Put');
  if (!record) {
    return event;
  }

  const Bucket = record.s3.bucket.name;
  const Key = record.s3.object.key;

  const client = new S3Client({ region: process.env.REGION });
  const getCommand = new GetObjectCommand({ Bucket, Key });

  const response = await client.send(getCommand);
  if (!response?.Body) {
    return event;
  }

  await new Promise<void>((resolve, reject) => {
    (response.Body as Readable)
      .pipe(csv({ strict: true }))
      .on('data', data => {
        console.log(`file data: ${JSON.stringify(data)}`);
      })
      .on('error', reject)
      .on('end', () => {
        console.log('file parsing is finished');
        resolve();
      });
  });
  
  const copyCommand = new CopyObjectCommand({
    CopySource: `${Bucket}/${Key}`,
    Bucket,
    Key: Key.replace(/^uploaded/, 'parsed')
  });

  await client.send(copyCommand);

  return event;
};