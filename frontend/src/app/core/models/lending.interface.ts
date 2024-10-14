export interface Lending {
  id: number| null;
  date: Date| null;
  state: string| null;
  comments: string | null;
  borrowerId: number;
  teacherId: number | null;
  contains: Contains[];
}

export interface Contains{
  lendingId: number | null;
  productId: number;
  amount: number;
}
