import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() =>
    this.cart()?.items.reduce((count, item) => count + item.quantity, 0)
  );
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;

    let subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  });
  constructor() {}

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      tap((cart) => {
        this.cart.set(cart);
      })
    );
  }
  setCart(cart: Cart) {
    this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe((cart) => {
      this.cart.set(cart);
    });
  }
  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const index = cart.items.findIndex((i) => i.productId === productId);

    if (index !== -1) {
      if (quantity < cart.items[index].quantity) {
        cart.items[index].quantity -= quantity;
      } else cart.items.splice(index, 1);
      if (cart.items.length === 0) {
        this.deleteCart();
      } else this.setCart(cart);
    }
  }
  deleteCart() {
    this.http
      .delete(this.baseUrl + 'cart?id=' + this.cart()?.id)
      .subscribe(() => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      });
  }
  private addOrUpdateItem(
    items: CartItem[],
    item: CartItem,
    quantity: number
  ): CartItem[] {
    const index = items.findIndex((i) => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type,
    };
  }
  private isProduct(item: CartItem | Product): item is Product {
    return 'id' in item;
  }
  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}
