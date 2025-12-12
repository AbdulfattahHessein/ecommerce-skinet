import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { CartService } from '../../../core/services/cart.service';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { CreditCardPipe } from '../../../shared/pipes/credit-card.pipe';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CurrencyPipe, AddressPipe, CreditCardPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss'
})
export class CheckoutReviewComponent implements OnInit {

  cartService = inject(CartService);
  confirmationToken = input<ConfirmationToken>();

  ngOnInit(): void {

  }

}
