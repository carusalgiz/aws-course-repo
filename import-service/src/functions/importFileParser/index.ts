import { handlerPath } from "@libs/handler-resolver";
import { env } from "process";

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: env.s3BucketName || 'node-aws-course-import-service',
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }, { suffix: ".csv" }],
        existing: true,
        forceDeploy: true
      }
    }
  ]
};
