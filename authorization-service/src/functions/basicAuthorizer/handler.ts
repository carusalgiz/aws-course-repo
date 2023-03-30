import {
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayRequestSimpleAuthorizerHandlerV2,
    APIGatewaySimpleAuthorizerResult
  } from 'aws-lambda';
import logger from '../../libs/logger';
  
  export const basicAuthorizer: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (
    event: APIGatewayRequestAuthorizerEventV2
  ): Promise<APIGatewaySimpleAuthorizerResult> => {
    logger('basicAuthorizer', event);
    const b64auth = event.identitySource[0].split(' ')[1] ?? '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const isAuthorized = !!(login && password && process.env[login] === password);
    return { isAuthorized };
  };