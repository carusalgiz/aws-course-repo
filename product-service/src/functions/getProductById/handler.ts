import { APIGatewayProxyHandler } from 'aws-lambda';
import { productService } from 'src/config/serviceDBinit';

const headers = {
    "Access-Control-Allow-Origin": "*"
};

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    console.log("getProductById incoming request: ", event.path, " Body: ", event.body, " QueryParams: ", event.queryStringParameters, " PathParams: ", event.pathParameters);

    if (event.pathParameters?.productId) {
        const { productId } = event.pathParameters;
        try {
            const product = await productService.getProductById(productId);

            if (product) {
                return {
                    headers,
                    statusCode: 200,
                    body: JSON.stringify(product)
                }
            } else {
                return {
                    headers,
                    statusCode: 404,
                    body: JSON.stringify({ errorMessage: `Product with id "${productId}" doesn't exist` })
                }
            }
        } catch (error) {
            return {
                headers,
                statusCode: 500,
                body: JSON.stringify({ errorMessage: `Issue appeared while trying to receive a product`, error })
            }
        }
    } else {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({ errorMessage: "ProductId parameter is missing" })
          }
    }  
}