import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = 'https://localhost:5001/api/'
  private http = inject(HttpClient);
  orderComplete = false;
  completedOrder: Order | null = null;
  completedOrderId: number | null = null;

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'order', orderToCreate);
  }

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseUrl + 'order');
  }

  getOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseUrl + 'order/' + id);
  }
}