import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true
      },
    },
  ],
  queryStringParameters: {
    name: {
      required: true,
      type: 'string',
      description: 'File name'
    }
  }
};
