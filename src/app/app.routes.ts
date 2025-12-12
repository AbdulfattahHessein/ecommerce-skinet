import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { emptyCartGuard } from './core/guards/empty-cart.guard';
import { LoginComponent } from './fearures/account/login/login.component';
import { RegisterComponent } from './fearures/account/register/register.component';
import { CartComponent } from './fearures/cart/cart.component';
import { CheckoutSuccessComponent } from './fearures/checkout/checkout-success/checkout-success.component';
import { CheckoutComponent } from './fearures/checkout/checkout.component';
import { NotFoundComponent } from './fearures/not-found/not-found.component';
import { ServerErrorComponent } from './fearures/server-error/server-error.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { ShopComponent } from './features/shop/shop.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'shop/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard, emptyCartGuard],
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccessComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account/login',
    component: LoginComponent,
  },
  {
    path: 'account/register',
    component: RegisterComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
