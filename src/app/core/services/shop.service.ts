import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination, Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shop-params';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brands && shopParams.brands.length > 0)
      params = params.append('brands', shopParams.brands.join(','));

    if (shopParams.types && shopParams.types.length > 0)
      params = params.append('types', shopParams.types.join(','));

    if (shopParams.sort) params = params.append('sort', shopParams.sort);

    if (shopParams.search) params = params.append('search', shopParams.search);

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('sort', shopParams.sort);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {
      params,
    });
  }

  getBrands() {
    if (this.brands.length > 0) return;
    return this.http
      .get<string[]>(this.baseUrl + 'products/brands')
      .subscribe((data) => (this.brands = data));
  }
  getTypes() {
    if (this.types.length > 0) return;

    return this.http
      .get<string[]>(this.baseUrl + 'products/types')
      .subscribe((data) => (this.types = data));
  }

  constructor() {}
}