import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import basicAuthorizer from './src/functions/basicAuthorizer';

const env = dotenv.config().parsed;
if (!env) {
  throw Error('env is not specified');
}

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    memorySize: 512,
    timeout: 10,
    environment: env
  },
  // import the function via paths
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;