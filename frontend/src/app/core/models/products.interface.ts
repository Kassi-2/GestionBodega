export interface Product {
  idProduct: number;
  name: string;
  description: string;
  stock: number | null;
  criticalStock: number | null;
  status: boolean;
  isFungible: boolean;
}
