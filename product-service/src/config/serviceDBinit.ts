import createDynamoDBClient from 'src/config/dbConfig';
import { ProductService } from 'src/services/product-service.service';
const { PRODUCTS_TABLE, STOCKS_TABLE } = process.env;
const dynamoDB = createDynamoDBClient;

export const productService = new ProductService(dynamoDB, PRODUCTS_TABLE, STOCKS_TABLE);