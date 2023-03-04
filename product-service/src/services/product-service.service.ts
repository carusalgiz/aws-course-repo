import { DocumentClient } from "aws-sdk/clients/dynamodb";
import ProductResult from "src/model/ProductResult";
import Stock from "src/model/Stock";
import Product from "../model/Product";

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
      const stock = stocks.Items.find(
        (stock: Stock) => stock.product_id === product.id
      );
      const count: number = stock?.count || 0;
      return { ...product, count };
    });

    return result as ProductResult[];
  }

  async getProductById(productId: string): Promise<ProductResult> {
    const transact = await this.docClient
        .transactGet({
            TransactItems: [
            {
                Get: {
                TableName: this.productTableName,
                Key: { id: productId },
                },
            },
            {
                Get: {
                TableName: this.stocksTableName,
                Key: { product_id: productId },
                },
            },
            ],
        })
        .promise();

    const product = transact.Responses[0]?.Item as Product;
    const stock = transact.Responses[1]?.Item as Stock;

    return { ...product, count: stock?.count || 0 };
  }

  async createProduct(product: Product): Promise<ProductResult> {
    await this.docClient
      .transactWrite({
        TransactItems: [
          {
            Put: {
              Item: product,
              TableName: this.productTableName,
            },
          },
          {
            Put: {
              Item: {
                product_id: product.id,
                count: 1,
              },
              TableName: this.stocksTableName,
            },
          },
        ],
      })
      .promise();

    return { ...product, count: 1 };
  }
}
