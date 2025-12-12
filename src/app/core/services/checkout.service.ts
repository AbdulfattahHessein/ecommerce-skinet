import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryMethod } from '../../shared/models/delivery-method';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  deliveryMethods: DeliveryMethod[] = [];

  getDeliveryMethods() {
    if (this.deliveryMethods.length > 0) {
      return of(this.deliveryMethods);
    }

    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods')
      .pipe(
        tap(methods => this.deliveryMethods = methods.sort((a, b) => a.price - b.price))
      );
  }
}
