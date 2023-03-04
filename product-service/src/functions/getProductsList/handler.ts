import { APIGatewayProxyHandler } from 'aws-lambda';
import { productService } from 'src/config/serviceDBinit';

const headers = {
  "Access-Control-Allow-Origin": "*"
};

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  console.log("getProductsList incoming request: ", event.path, " Body: ", event.body, " QueryParams: ", event.queryStringParameters, " PathParams: ", event.pathParameters);
  
  try {
    const products = await productService.getProductList();

    return {
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify([...products])
    }
  } catch (error) {
    return {
        headers,
        statusCode: 500,
        body: JSON.stringify({ errorMessage: `Issue appeared while trying to receive a product list`, error })
    }
  }
}