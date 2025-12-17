import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import { OrderService } from '../../../core/services/order.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { AddressPipe } from "../../../shared/pipes/address.pipe";
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink, MatButton, DatePipe, CurrencyPipe, AddressPipe, PaymentCardPipe, MatProgressSpinner, NgIf],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnDestroy {

  signalr = inject(SignalrService);
  private orderService = inject(OrderService)
  ngOnDestroy(): void {
    this.orderService.orderComplete = false;
    this.signalr.order.set(null);
  }
}
