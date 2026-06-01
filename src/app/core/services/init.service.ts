import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; // 👈 لا تنسَ استيراد catchError
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private cartService = inject(CartService);
  private accountService = inject(AccountService)

  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return forkJoin({
        cart$ : cart$,
        // ✅ التقاط الخطأ هنا حتى لا تنهار الـ forkJoin إذا كان الرد 401
        user : this.accountService.getUserInfo().pipe(
          catchError(() => of(null))
        )
    });
  }

}