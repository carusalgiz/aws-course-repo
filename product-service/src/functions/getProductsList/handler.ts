import { APIGatewayProxyHandler } from 'aws-lambda';
import { ProductService } from 'src/services/product-service.service';

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
  const productService = new ProductService();
  const products = await productService.getProductList();

  return {
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
    body: JSON.stringify([...products])
  }
}