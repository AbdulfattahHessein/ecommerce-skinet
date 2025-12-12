import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value?: ConfirmationToken['shipping'], ...args: unknown[]): unknown {

    if (value?.address && value.name) {
      const {
        city,
        country,
        line1,
        line2,
        postal_code,
        state
      } = value.address;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state ? state + ', ' : ''}${postal_code}, ${country}`;
    }
    return 'Unknown Address';
  }

}
