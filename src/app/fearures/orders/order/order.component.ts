import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [AsyncPipe, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  orderService = inject(OrderService)

  orders$ = this.orderService.getOrdersForUser();

}
