export type Pagination<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
};
