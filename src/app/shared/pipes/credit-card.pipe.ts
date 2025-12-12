import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'creditCard',
  standalone: true
})
export class CreditCardPipe implements PipeTransform {

  transform(value?: ConfirmationToken.PaymentMethodPreview, ...args: unknown[]): unknown {
    if (value?.card) {
      const { brand, last4, exp_month, exp_year } = value.card;

      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }
    return 'Unknown Payment Method';
  }

}
