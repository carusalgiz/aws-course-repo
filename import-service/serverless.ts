import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';
import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    region: "eu-west-1",
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      s3BucketName: 'node-aws-course-import-service',
      queueName: 'catalogItemsQueue'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: [
              'arn:aws:s3:::${self:provider.environment.s3BucketName}',
              'arn:aws:s3:::${self:provider.environment.s3BucketName}/*'
            ]
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: {
              'Fn::Sub': 'arn:aws:sqs:${self:provider.region}:${AWS::AccountId}:${self:provider.environment.queueName}'
            }
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      ProductsShopImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.s3BucketName}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST'],
                AllowedOrigins: ['*'],
                ExposedHeaders: []
              }
            ]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
