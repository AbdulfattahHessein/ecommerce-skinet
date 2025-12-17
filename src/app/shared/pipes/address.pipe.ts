import { Pipe, PipeTransform } from '@angular/core';
import { PaymentIntent } from '@stripe/stripe-js';
import { ShippingAddress } from '../models/order';

@Pipe({
  name: 'address',
  standalone: true,
})
export class AddressPipe implements PipeTransform {
  transform(value?: PaymentIntent.Shipping | ShippingAddress | null): string {
    if (value && 'address' in value && value.address && value.name) {
      const { city, country, line1, line2, postal_code, state } =
        value.address;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state ? state + ', ' : ''
        }${postal_code}, ${country}`;
    } else if (value && 'line1' in value && value.name) {
      const { city, country, line1, line2, postalCode, state } = value;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state ? state + ', ' : ''
        }${postalCode}, ${country}`;
    }
    return 'Unknown Address';
  }
}
