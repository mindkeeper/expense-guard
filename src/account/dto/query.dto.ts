export type TAccountQuery = {
  accountName?: string;
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
};
