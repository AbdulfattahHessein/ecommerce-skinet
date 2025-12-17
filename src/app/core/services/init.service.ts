import { inject, Injectable } from '@angular/core';
import { forkJoin, of, tap } from 'rxjs';
import { AccountService } from './account.service';
import { CartService } from './cart.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private signalr = inject(SignalrService);
  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);
    return forkJoin([
      cart$,
      this.accountService.getUserInfo().pipe(tap((user) => {

        if (user) this.signalr.createHubConnection()
      })),
    ]);
  }
  constructor() { }
}
