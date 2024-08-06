export interface IPaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
  };
}

export type TPaginateOptions = {
  page?: number;
  perPage?: number;
};

export type TPaginateFunction = <T, K>(
  model: any,
  args: K,
  options: TPaginateOptions,
) => Promise<IPaginatedResult<T>>;

export const paginator = (
  defaultOptions: TPaginateOptions,
): TPaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = options.page || defaultOptions.page || 1;
    const perPage = options.perPage || defaultOptions.perPage || 10;
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const [items, total] = await Promise.all([
      model.findMany({
        ...args,
        skip,
        take: perPage,
      }),
      model.count({ where: args.where }),
    ]);

    const totalPages = Math.ceil(total / perPage);
    return {
      items,
      meta: {
        total,
        currentPage: page,
        perPage,
        totalPages,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  };
};
