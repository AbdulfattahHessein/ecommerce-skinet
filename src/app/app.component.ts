import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { Pagination, Product } from './shared/models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  baseUrl = 'https://localhost:5001/api/';
  title = 'skinet-client';
  private http = inject(HttpClient);
  products: Product[] = [];

  ngOnInit(): void {
    this.http
      .get<Pagination<Product>>(this.baseUrl + 'products')
      .subscribe((data) => {
        this.products = data.data;
        console.log(data);
      });
  }
}
