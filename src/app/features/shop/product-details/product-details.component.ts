import { Product } from './../../../shared/models/product';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    SlicePipe,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  product$: Observable<Product> | undefined;
  ngOnInit() {
    this.loadProduct();
  }
  loadProduct() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.product$ = this.shopService.getProductById(id);
  }
  addItemToBasket() {
    throw new Error('Method not implemented.');
  }
}
