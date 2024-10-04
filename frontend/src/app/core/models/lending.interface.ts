export interface Lending {
  id: number;
  date: Date;
  state: string;
  comments: string | null;
  borrowerId: number;
  lendingProducts: productsLending[];
}

export interface productsLending{
  lendingId: number;
  productId: number;
  amount: number;
}
