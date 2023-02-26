import { APIGatewayProxyHandler } from 'aws-lambda';
import { ProductService } from 'src/services/product-service.service';

const headers = {
    "Access-Control-Allow-Origin": "*"
};

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    if (event.pathParameters?.productId) {
        const productService = new ProductService();

        const { productId } = event.pathParameters;
        const product = await productService.getProductById(+productId);

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
    } else {
        return {
            headers,
            statusCode: 400,
            body: JSON.stringify({ errorMessage: "ProductId parameter is missing" })
          }
    }  
}