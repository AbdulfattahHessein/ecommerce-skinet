import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from "@angular/material/button";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from "@angular/router";
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StripeService } from '../../core/services/stripe.service';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { Address } from '../../shared/models/user';
import { CheckoutDeliveryComponent } from "./checkout-delivery/checkout-delivery.component";
import { CheckoutReviewComponent } from "./checkout-review/checkout-review.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [OrderSummaryComponent, MatProgressSpinnerModule, CurrencyPipe, FormsModule, MatStepperModule, RouterLink, MatButton, MatCheckboxModule, CheckoutDeliveryComponent, CheckoutReviewComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {

  private stripeService = inject(StripeService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  private snackbar = inject(SnackbarService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  router = inject(Router);
  orderService = inject(OrderService);
  loading = false;

  saveAddress: boolean = false;
  completionStatus = signal<{ address: boolean, card: boolean, delivery: boolean }>({
    address: false,
    card: false,
    delivery: false
  });

  confirmationToken?: ConfirmationToken;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.CreateAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.onAddressChange);

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element')
      this.paymentElement.on('change', this.onPaymentChange);
    } catch (error: any) {
      this.snackbar.error(error.message);
    }
  }

  onAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(status => {
      status.address = event.complete;
      return status;
    });
  }

  onPaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(status => {
      status.card = event.complete;
      return status;
    });
  }

  onDeliveryComplete = (complete: boolean) => {
    this.completionStatus.update(status => {
      status.delivery = complete;
      return status;
    });
  }


  async getConfirmationToken() {

    try {
      if (Object.values(this.completionStatus()).every(status => status)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
      };
    } catch (error: any) {
      this.snackbar.error(error.message);
    }
  }
  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;

        address && await firstValueFrom(this.accountService.updateAddress(address))

        this.snackbar.success('Address saved successfully.');
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken);
        if (result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));
          if (orderResult) {
            this.orderService.orderComplete = true;
            this.cartService.deleteCart();
            this.cartService.selectedDeliveryMethod.set(null);
            this.router.navigateByUrl('/checkout/success');
          } else {
            throw new Error('Order could not be created.');
          }
        }
        else if (result.error) {
          throw new Error(result.error.message)
        }
        else {
          throw new Error('Something went wrong.');
        }
      }
    } catch (error: any) {
      this.snackbar.error(error.message || 'Something went wrong.');
      stepper.previous();
    }
    finally {
      this.loading = false;
    }
  }


  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;

    const card = this.confirmationToken?.payment_method_preview?.card;

    if (!cart?.id || !cart?.deliveryMethodId || !shippingAddress || !card) {
      throw new Error('Something went wrong.');
    }


    return {
      cartId: cart.id,
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress,
      paymentSummary: {
        brand: card.brand,
        last4: +card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year
      }
    };

  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue()
    const address = result?.value.address;
    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country
      };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}
