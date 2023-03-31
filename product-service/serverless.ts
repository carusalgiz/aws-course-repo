import type { AWS } from "@serverless/typescript";
import * as dotenv from 'dotenv';
import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: "shop-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  provider: {
    region: "eu-west-1",
    name: "aws",
    runtime: "nodejs14.x",
    iamRoleStatements: [{
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: ["arn:aws:dynamodb:eu-west-1:*:*", "arn:aws:lambda:eu-west-1:*:*"]
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn']
        }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'CreateProductSNSTopic' }
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: "products",
      STOCKS_TABLE: "stocks"
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },    
    topicName: env.TOPIC_NAME,
    topicArn: 'arn:aws:sns:${aws:region}:${aws:accountId}:${self:custom.topicName}',
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: env.QUEUE_NAME,
          DelaySeconds: '0',
          MaximumMessageSize: '262144',
          MessageRetentionPeriod: '345600',
          ReceiveMessageWaitTimeSeconds: '1',
          VisibilityTimeout: '30'
        }
      },
      CreateProductSNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: env.TOPIC_NAME
        }
      },
      CreateProductSNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          TopicArn: { Ref: 'CreateProductSNSTopic' },
          Endpoint: env.EMAIL1,
          Protocol: 'email'
        }
      },
      CreateProductSNSSubscriptionWithFilterPolicy: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          TopicArn: { Ref: 'CreateProductSNSTopic' },
          Endpoint: env.EMAIL2,
          Protocol: 'email',
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: '{"products":{"price":[{"numeric":[">=",10]}]}}'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
