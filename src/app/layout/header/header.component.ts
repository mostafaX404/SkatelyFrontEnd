import { Component, inject } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatBadgeModule } from '@angular/material/badge'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { Router, RouterModule } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { IsAdmin } from '../../shared/directives/is-admin';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterModule,
    MatProgressBarModule,
    MatMenu,
    MatDivider,
    MatMenuItem,
    MatMenuTrigger,
    IsAdmin
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
[x: string]: any;

  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService)
  private router = inject(Router)


  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.router.navigateByUrl('/');

      }
    })
  }
}
