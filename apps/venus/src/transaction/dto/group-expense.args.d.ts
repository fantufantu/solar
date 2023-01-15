export interface GroupExpenseArgs {
  categoryIds: number[];
  from: Date;
  to: Date;
}

export interface GroupedExpense {
  categoryId: number;
  amount: number;
}
