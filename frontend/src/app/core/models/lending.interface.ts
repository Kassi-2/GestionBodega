export interface Lending {
  id: number;
  date: Date;
  state: string;
  comments?: string;
  borrowerId: number;
  borrowerName: string
  teacherId?: number;
  teacherName?: string;
  lendingProducts: lendingProducts[];
}

export interface lendingProducts{
  lendingId: number;
  productId: number;
  name: string;
  stock: number;
  amount: number;
}

export interface newLending {
  comments?: string;
  BorrowerId: number;
  teacherId: number | null;
  products: contains[];
}

export interface contains {
  productId: number;
  amount: number;
}


