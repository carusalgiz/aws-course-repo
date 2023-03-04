import { APIGatewayProxyHandler } from 'aws-lambda';
import { productService } from 'src/config/serviceDBinit';

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  const products = await productService.getProductList();

  return {
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
    body: JSON.stringify([...products])
  }
}