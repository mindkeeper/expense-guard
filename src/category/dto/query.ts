export type TCategoryQuery = {
  categoryName?: string;
  categoryKey?: string;
  categoryType?: 'INCOME' | 'EXPENSE';
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
};
