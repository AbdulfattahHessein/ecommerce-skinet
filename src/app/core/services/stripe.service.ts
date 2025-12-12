import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart } from '../../shared/models/cart';
import { AccountService } from './account.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private stripePromise: Promise<Stripe | null>;
  private elements?: StripeElements;
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

  http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  cartService = inject(CartService);
  accountService = inject(AccountService);

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());

        this.elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: {
            labels: 'floating',
          }
        });
      }
      else {
        throw new Error('Stripe has not loaded properly.');
      }
    }

    return this.elements;
  }

  async createPaymentElement() {
    if (!this.paymentElement) {
      const elements = await this.initializeElements();
      if (elements) {
        this.paymentElement = elements.create("payment");
      }
      else {
        throw new Error('Element instance has not been initialized')
      }
    }
    return this.paymentElement;
  }

  async CreateAddressElement() {
    if (this.addressElement) return this.addressElement;

    const elements = await this.initializeElements();

    if (!elements) throw new Error('Stripe Elements has not been initialized.');


    const user = this.accountService.currentUser();

    let defaultValues: StripeAddressElementOptions['defaultValues'] = {}

    if (user) {
      if (user.firstName)
        defaultValues.name = user.firstName;

      if (user.lastName)
        defaultValues.name += " " + user.lastName;

      if (user.address) {
        defaultValues.address = {
          country: user.address.country,
          line1: user.address.line1,
          line2: user.address.line2,
          city: user.address.city,
          state: user.address.state,
          postal_code: user.address.postalCode
        };
      }
    }

    const options: StripeAddressElementOptions = {
      mode: 'shipping',
      defaultValues: defaultValues,
    }

    this.addressElement = elements.create('address', options);

    return this.addressElement;

  }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Problem with cart');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {})
      .pipe(tap(c => {
        this.cartService.setCart(c);
      }));
  }

  async createConfirmationToken() {
    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();
    if (result.error) {
      throw new Error(result.error.message);
    }

    if (stripe) {
      return await stripe.createConfirmationToken({
        elements
      });
    }
    else {
      throw new Error('Stripe has not loaded properly.');
    }
  }

  async confirmPayment(confirmationToken: ConfirmationToken) {

    const stripe = await this.getStripeInstance();
    const elements = await this.initializeElements();
    const result = await elements.submit();
    if (result.error) {
      throw new Error(result.error.message);
    }
    const clientSecret = this.cartService.cart()?.clientSecret;
    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id,
        },
        redirect: 'if_required'
      });
    }
    else {
      throw new Error('Stripe has not loaded properly.');
    }
  }

  disposeElements() {
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }

}
