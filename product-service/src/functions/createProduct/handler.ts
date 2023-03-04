import { APIGatewayProxyHandler } from "aws-lambda";
import * as uuid from "uuid";
import { productService } from 'src/config/serviceDBinit';

const headers = {
    "Access-Control-Allow-Origin": "*"
};
  
export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
    const { title, description, price } = JSON.parse(event.body);

    try {
        const productId: string = uuid.v4();
        const product = await productService.createProduct({
          id: productId,
          title,
          description,
          price
        });
  
        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(product)
        }
      } catch (error) {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({ errorMessage: `Issue appeared while trying to create a product`, error })
        }
      }
};
