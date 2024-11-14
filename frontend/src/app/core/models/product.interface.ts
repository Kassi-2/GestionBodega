import { Category } from './category.interface';

export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  criticalStock: number;
  state: boolean;
  fungible: boolean;
  categoryId: number;
  category?: Category;
}

export interface NewProduct {
  name: string;
  description: string;
  stock: number;
  criticalStock: number | null;
  fungible: boolean;
  categoryId: number;
}
