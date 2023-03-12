import { APIGatewayProxyEvent } from "aws-lambda";

export default function logger(
  functionName: string,
  event: APIGatewayProxyEvent
): void {
  console.log(
    `${functionName} incoming request: ${event.path},
    Body: ${event.body},
    QueryParams: ${event.queryStringParameters},
    PathParams: ${event.pathParameters}`
  );
}
