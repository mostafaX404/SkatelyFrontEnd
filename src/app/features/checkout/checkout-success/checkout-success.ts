import { Component, inject } from '@angular/core';
import { SignalrService } from '../../../core/services/signalr-service';
import { OrderService } from '../../../core/services/order-service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';

@Component({
  selector: 'app-checkout-success',
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    AddressPipe,
    CurrencyPipe,
    CardPipe
  ],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss',
})
export class CheckoutSuccess {

  signalrService = inject(SignalrService);
  private orderService = inject(OrderService);

  ngOnInit(): void {
    if (this.signalrService.orderSignal()) {
      return;
    }

    if (this.orderService.completedOrder) {
      this.signalrService.orderSignal.set(this.orderService.completedOrder);
      return;
    }

    const orderId = this.orderService.completedOrderId;
    if (orderId) {
      this.orderService.getOrderDetailed(orderId).subscribe({
        next: order => this.signalrService.orderSignal.set(order)
      });
    }
  }

  ngOnDestroy(): void {
    this.orderService.orderComplete = false;
    this.orderService.completedOrder = null;
    this.orderService.completedOrderId = null;
    this.signalrService.orderSignal.set(null);
  }
}
