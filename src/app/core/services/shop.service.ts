import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor() { }

  private baseUrl = 'https://localhost:5001/api/'
  private http = inject(HttpClient)

  types: string[] = [];
  brands: string[] = [];


  getProducts(_shopParams: ShopParams) {

    let params = new HttpParams();

    if (_shopParams.brands.length > 0) {
      params = params.append('brands', _shopParams.brands.join(','));
    }


    if (_shopParams.types.length > 0) {
      params = params.append('types', _shopParams.types.join(','));
    }

    if (_shopParams.sort) {
      params = params.append('sort', _shopParams.sort);
    }

    if (_shopParams.search) {
      params = params.append('search', _shopParams.search);
    }


    params = params.append('pageSize', _shopParams.pageSize);
    params = params.append('pageIndex', _shopParams.pageNumber);

    return this.http.get<Pagination<Product>>(this.baseUrl + 'products', { params });
  }


  getBrands() {
    if (this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response
    });
  }


  getTypes() {
    if (this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response
    });
  }



  getProduct(id: number) {

    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }


}