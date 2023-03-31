import { Handler } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import logger from "@libs/logger";

const headers = {
  "Access-Control-Allow-Origin": "*",
};

export const importProductsFile: Handler = async (event) => {
  logger("importProductsFile", event);

  if (event?.queryStringParameters?.name) {
    const name = event.queryStringParameters.name;

    const client = new S3Client({ region: process.env.REGION });
    const command = new PutObjectCommand({
      Bucket: process.env.s3BucketName,
      Key: `uploaded/${name}`,
    });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } else {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ errorMessage: "'name' parameter is missing" }),
    };
  }
};
