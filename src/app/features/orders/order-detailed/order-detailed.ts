import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../shared/models/order';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { AddressPipe } from '../../../shared/pipes/address-pipe';

@Component({
  selector: 'app-order-detailed',
  imports: [MatButton , MatCardModule,CurrencyPipe,DatePipe,CardPipe,AddressPipe],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss',
})
export class OrderDetailed {

private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  order?: Order;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    
    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order = order
    });
  }

}


