import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../shared/models/order';
import { ActivatedRoute, Router } from '@angular/router'; // ضيفنا Router هنا
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin-service';

@Component({
  selector: 'app-order-detailed',
  imports: [MatCardModule, CurrencyPipe, DatePipe, CardPipe, AddressPipe],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss',
})
export class OrderDetailed implements OnInit {

  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private adminService = inject(AdminService); 
  private router = inject(Router);
  
  order?: Order;
  
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to orders';

  ngOnInit(): void {
    this.loadOrder();
  }

  onReturnClick() {
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders');
  }

  loadOrder() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    const loadOrderData = this.accountService.isAdmin()
      ? this.adminService.getOrder(+id)
      : this.orderService.getOrderDetailed(+id);

    loadOrderData.subscribe({
      next: order => this.order = order
    });
  }
}