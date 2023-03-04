import { APIGatewayProxyHandler } from "aws-lambda";
import * as uuid from "uuid";
import { productService } from 'src/config/serviceDBinit';

const headers = {
    "Access-Control-Allow-Origin": "*"
};
  
export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log("createProduct incoming request: ", event.path, " Body: ", event.body, " QueryParams: ", event.queryStringParameters, " PathParams: ", event.pathParameters);
  const { title, description, price } = JSON.parse(event.body);

  if (!title || !description || !price) {
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
          statusCode: 500,
          body: JSON.stringify({ errorMessage: `Issue appeared while trying to create a product`, error })
      }
    }
  } else {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ errorMessage: `Product data is invalid. Please check that product have all required fields` })
    }
  }  
};
