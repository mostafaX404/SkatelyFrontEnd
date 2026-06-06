import { Component, effect, inject, OnInit, Pipe } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { pipe } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, MatButtonModule, MatIconModule, FormsModule, MatDividerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {


  private shopService = inject(ShopService)
  private activateRoute = inject(ActivatedRoute)
  private cartService = inject(CartService);
  product?: Product;
  quantityInCart = 0;
  quantity = 1;

constructor() {
  effect(() => {
    const cart = this.cartService.cart();
    this.updateQuantityOnCart();
  });
}

  ngOnInit(): void {
    this.loadProudct();
  }



  loadProudct() {

    const id = this.activateRoute.snapshot.paramMap.get('id');

    if (!id) return;
    this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.product = product
        this.updateQuantityOnCart();
      },
      error: error => console.log(error)
    });
  }

  updateQuantityOnCart() {
    this.quantityInCart = this.cartService.cart()?.items
      .find(x => x.productId == this.product?.id)?.quantity || 0;

    this.quantity = this.quantityInCart || 1;
  }

  getButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart'
  }

updateCart() {
  if (!this.product) return;

  const diff = this.quantity - this.quantityInCart;

  if (diff > 0) {
    this.cartService.addItemToCart(this.product, diff);
  } 
  else if (diff < 0) {
    this.cartService.asyncremoveItemFromCart(this.product.id, Math.abs(diff));
  }

  this.quantityInCart = this.quantity;
}
}



