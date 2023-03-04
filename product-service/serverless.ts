import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductById from "@functions/getProductById";
import createProduct from "@functions/createProduct";

const serverlessConfiguration: AWS = {
  service: "shop-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  // resources: {
  //   Resources: {
  //     ProductsTable: {
  //       Type: "AWS::DynamoDB::Table",
  //       Properties: {
  //         TableName: '${self:provider.environment.PRODUCTS_TABLE}',
  //         KeySchema: [{
  //           AttributeName: "id",
  //           KeyType: "HASH",
  //         }],
  //         AttributeDefinitions: [{
  //           AttributeName: "id",
  //           AttributeType: "S",
  //         }],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: 1,
  //           WriteCapacityUnits: 1,
  //         },
  //       },
  //     },
  //     StocksTable: {
  //       Type: "AWS::DynamoDB::Table",
  //       Properties: {
  //         TableName: '${self:provider.environment.STOCKS_TABLE}',
  //         KeySchema: [{
  //           AttributeName: "product_id",
  //           KeyType: "HASH",
  //         }],
  //         AttributeDefinitions: [{
  //           AttributeName: "product_id",
  //           AttributeType: "S",
  //         }],
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: 1,
  //           WriteCapacityUnits: 1,
  //         },
  //       },
  //     }
  //   },
  // },
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
  functions: { getProductsList, getProductById, createProduct },
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
  },
};

module.exports = serverlessConfiguration;
