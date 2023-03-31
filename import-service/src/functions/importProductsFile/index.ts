import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
        authorizer: {
          name: 'httpApiAuthorizer'
        },
        queryStringParameters: {
          name: {
            required: true,
            type: 'string',
            description: 'File name'
          }
        }
      }
    }
  ]
};
