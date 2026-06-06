import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Order } from '../../shared/models/order';
import { OrderParams } from '../../shared/models/orderParams';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
   baseUrl:string = 'https://localhost:5001/api/'
   
    private http = inject(HttpClient)



    getOrders(orderparams : OrderParams){

      var params = new HttpParams();

      if(orderparams.filter && orderparams.filter !=='All'){
        params = params.append('filter',orderparams.filter);
      }

      params = params.append('pageIndex',orderparams.pageNumber);
      params = params.append('pageSize',orderparams.pageSize)
    
      return this.http.get<Pagination<Order>>(this.baseUrl + 'admin/orders',{params});
    }


    getOrder(id:number){
      return this.http.get<Order>(this.baseUrl+'admin/orders/'+id)
    }


    refundOrder(id:number){
      return this.http.post<Order>(this.baseUrl+'admin/refund/'+id,{})
    }
}
