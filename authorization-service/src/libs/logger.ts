export default function logger(
  functionName: string,
  event: any
): void {
  console.log(
    `${functionName} incoming request: ${event?.path},
    Body: ${event?.body},
    QueryParams: ${event?.queryStringParameters},
    PathParams: ${event?.pathParameters}`
  );
}
