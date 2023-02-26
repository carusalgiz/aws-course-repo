import products from "src/data/mock";

export class ProductService {
    getProductList = async () => products;

    getProductById = async (productId) => {
        const productById = products.find((product) => product.id === productId);

        return productById;
    };
}