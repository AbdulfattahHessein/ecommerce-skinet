import { Product } from './../../../shared/models/product';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  product$: Observable<Product> | undefined;
  product?: Product;
  quantityInCart = 0;
  quantity = 1;
  ngOnInit() {
    this.loadProduct();
  }
  loadProduct() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.product$ = this.shopService.getProductById(id).pipe(
      tap((product) => {
        this.product = product;
        this.updateQuantity();
      })
    );
  }
  updateCart() {
    if (!this.product) return;
    if (this.quantity > this.quantityInCart) {
      this.cartService.addItemToCart(
        this.product,
        this.quantity - this.quantityInCart
      );

      this.quantityInCart = this.quantity;
    } else {
      this.cartService.removeItemFromCart(
        this.product.id,
        this.quantityInCart - this.quantity
      );
      this.quantityInCart = this.quantity;
    }
  }
  updateQuantity() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((i) => i.productId === this.product?.id)?.quantity ?? 0;
    this.quantity = Math.max(1, this.quantityInCart);
  }
  getButtonText() {
    return this.quantityInCart > 0 ? 'Update cart' : 'Add to cart';
  }
}
