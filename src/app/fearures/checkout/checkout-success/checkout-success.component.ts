import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatButton, MatMiniFabButton } from "@angular/material/button";

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink, MatButton, MatMiniFabButton],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {

}
