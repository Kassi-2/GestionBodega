export interface Lending {
  id: number;
  date: Date;
  state: string;
  comments: string | null;
  borrowerId: number;
  borrowerName: string
  teacherId: number | null;
  teacherName: string | null;
  lendingProducts: lendingProducts[];
}

export interface lendingProducts{
  lendingId: number;
  productId: number;
  name: string;
  stock: number;
  amount: number;
}

