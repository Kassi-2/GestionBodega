export interface Product {
    idProduct: number;
    name: string;
    description: string| null;
    stock: number;
    criticalStock: number ;
    status: boolean;
    isFungible: boolean;

}
