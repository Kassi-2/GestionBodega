export interface Lending {
  id: number;
  date: Date;
  state: string;
  comments?: string;
  borrowerId: number;
  borrower: Borrower;
  teacher: Teacher;
  teacherId?: number;
  lendingProducts: lendingProducts[];
}

export interface Borrower{
  name: string;
}

export interface Teacher{
  BorrowerId: Borrower;
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


