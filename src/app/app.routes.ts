import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guard/auth-guard';
import { orderCompleteGuard } from './core/guard/order-complete-guard';
import { cartGuard } from './core/guard/cart-guard';
import { CheckoutSuccess } from './features/checkout/checkout-success/checkout-success';
import { OrderComponent } from './features/orders/order';
import { OrderDetailed } from './features/orders/order-detailed/order-detailed';
import { AdminComponent } from './features/admin/admin';
import { adminGuard } from './core/guard/admin-guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'test-error', component: TestErrorComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: 'cart', component: CartComponent },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'checkout', component: CheckoutComponent , canActivate:[authGuard,cartGuard] },
    { path: 'orders', component: OrderComponent , canActivate:[authGuard] },
    { path: 'orders/:id', component: OrderDetailed , canActivate:[authGuard] },
    { path: 'checkout/success', component: CheckoutSuccess , canActivate:[authGuard, orderCompleteGuard] },
    { path: 'server-error', component: ServerErrorComponent },
    { path: 'shop/:id', component: ProductDetailsComponent },
    { path: 'admin', component: AdminComponent,canActivate:[authGuard,adminGuard] },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },

];
