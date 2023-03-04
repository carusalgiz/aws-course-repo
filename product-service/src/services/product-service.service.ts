// import products from "src/data/mock";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import ProductResult from "src/model/ProductResult";
import Stock from "src/model/Stock";
import Product from '../model/Product';

export class ProductService {
    constructor(
        private readonly docClient: DocumentClient,
        private readonly productTableName: string,
        private readonly stocksTableName: string
    ) {}
    
    async getProductList(): Promise<ProductResult[]> {
        const products = await this.docClient
            .scan({
                TableName: this.productTableName,
            })
            .promise();
        const stocks = await this.docClient
            .scan({
                TableName: this.stocksTableName,
            })
            .promise();

        const result: ProductResult[] = products.Items.map((product: Product) => {
            const stock = stocks.Items.find((stock: Stock) => stock.product_id === product.id);
            const count: number = stock?.count || 0;
            return { ...product, count };
        })
    
        return result as ProductResult[];
    }

    async getProductById(productId: string): Promise<ProductResult> {
        const product = await this.docClient
          .get({
            TableName: this.productTableName,
            Key: { id: productId },
          })
          .promise();

        const stock = await this.docClient
            .get({
                TableName: this.stocksTableName,
                Key: { product_id: productId },
            })
            .promise();

        const { id, description, title, price } = product?.Item;
    
        return { id, description, title, price, count: stock?.Item?.count || 0 };
    }

    async createProduct(product: Product): Promise<ProductResult> {
        await this.docClient
          .put({
            TableName: this.productTableName,
            Item: product,
          })
          .promise();

        await this.docClient
          .put({
            TableName: this.stocksTableName,
            Item: {
                product_id: product.id,
                count: 1
            },
          })
          .promise();
    
        return { ...product, count: 1};
    }
    // getProductList = async () => products;

    // getProductById = async (productId) => {
    //     const productById = products.find((product) => product.id === productId);

    //     return productById;
    // };
}