import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environments';
import { firstValueFrom, map, tap } from 'rxjs';
import { DeliveryMethod } from '../../shared/models/deliveryMethods';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl: string = 'https://localhost:5001/api/';
  http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  
selectedDelivery = signal<DeliveryMethod | null>(null);
totals = computed(() => {
  const cart = this.cart();
  const delivery = this.selectedDelivery();
  if (!cart) return null;
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = delivery ? delivery.price : 0;
  const discount = 0;
  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount
  }
})



  getCart(id: string) {
    return this.http.get<Cart>(`${this.baseUrl}cart?id=${id}`).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }


  setCart(cart: Cart) {
    console.log('Sending cart', cart);
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).pipe(
      tap(cart => {
        console.log('Returned cart', cart);
        this.cart.set(cart);
      })
    )
  }


  async addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProudctToCartItem(item);
    }
    const updatedItems = this.addOrUpdateItem(cart.items, item, quantity);

    const updatedCart = {
      ...cart,
      items: updatedItems
    };

    await firstValueFrom(this.setCart(updatedCart));
    console.log(cart)
  }

  async asyncremoveItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const index = cart.items.findIndex(x => x.productId === productId);
    if (index === -1) return;

    if (cart.items[index].quantity > quantity) {
      cart.items[index].quantity -= quantity;
    } else {
      cart.items.splice(index, 1);
    }

    if (cart.items.length === 0) {
      this.deleteCart();
    } else {
      await firstValueFrom(this.setCart(cart));
    }
  }

  deleteCart() {
    const id = this.cart()?.id;
    if (!id) return;

    this.http.delete(`${this.baseUrl}cart?id=${id}`).subscribe({
      next: () => {
        this.cart.set(null);
        localStorage.removeItem('cart_id');
      }
    });
  }

  // private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
  //   const index = items.findIndex(x => x.productId === item.productId);
  //   if (index === -1) {
  //     item.quantity = quantity;
  //     items.push(item);
  //   } else {
  //     items[index].quantity += quantity;
  //   }
  //   console.log(items[index].quantity);
  //   return items;
  // }


  // private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number =1): CartItem[] {
  //   const index = items.findIndex(x => x.productId === item.productId);
  //   if (index === -1) {
  //     // If item does not exist, set quantity and add to array
  //     item.quantity = quantity;
  //     items.push(item);
  //   } else {
  //     // If item exists, update the quantity safely
  //     if (items[index]) {
  //       console.log(index)
  //       items[index].quantity += quantity;
  //       console.log(index)

  //     } else {
  //       console.error(`Item at index ${index} is undefined.`);
  //     }
  //   }
  //   return items;
  // }


  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity = 1): CartItem[] {

    const index = items.findIndex(x => x.productId === item.productId);

    if (index === -1) {
      return [
        ...items,
        { ...item, quantity }
      ];
    }

    return items.map((x, i) =>
      i === index
        ? { ...x, quantity: x.quantity + quantity }
        : x
    );
  }

  mapProudctToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type

    };
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }



  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  constructor() { }
}

