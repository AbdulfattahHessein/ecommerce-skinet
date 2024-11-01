export type Pagination<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export type Product = {
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
  id: number;
};
