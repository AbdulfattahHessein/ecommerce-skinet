import { Component, inject, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';

import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { tap } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryMethod } from '../../../shared/models/delivery-method';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [MatRadioModule, FormsModule, CurrencyPipe, AsyncPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent {

  checkoutService = inject(CheckoutService);
  cart = inject(CartService);

  deliveryComplete = output<boolean>();

  methods$ = this.checkoutService.getDeliveryMethods().pipe(tap(methods => {
    const selectedMethodId = this.cart.cart()?.deliveryMethodId;
    if (selectedMethodId) {
      const method = methods.find(m => m.id === selectedMethodId);
      if (method) {
        this.cart.selectedDeliveryMethod.set(method);
        this.deliveryComplete.emit(true);
      }
    }
  }));

  updateCart(method: DeliveryMethod) {
    const cart = this.cart.cart();

    if (!cart) return;

    cart.deliveryMethodId = method.id;

    this.deliveryComplete.emit(true);

    this.cart.setCart(cart);
  }

}
