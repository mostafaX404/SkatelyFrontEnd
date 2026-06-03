import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DeliveryMethod } from '../../shared/models/deliveryMethods';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl =  'https://localhost:5001/api/';
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];

  getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods').pipe(
      map(methods => {
        this.deliveryMethods = methods.sort((a, b) => b.price - a.price);
        return methods;
      })
    )
  }
}