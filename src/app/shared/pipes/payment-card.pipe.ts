import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentSummary } from '../models/order';

@Pipe({
  name: 'paymentCard',
  standalone: true
})
export class PaymentCardPipe implements PipeTransform {

  transform(value?: ConfirmationToken.PaymentMethodPreview | PaymentSummary): string {
    if (value && 'card' in value && value.card) {
      const { brand, last4, exp_month, exp_year } = value.card;

      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }
    else if (value && 'last4' in value && value.brand) {

      const { brand, last4, expMonth: exp_month, expYear: exp_year } = value;

      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }
    else return 'Unknown Payment Method';
  }

}
