import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams({
      fromObject: {
        useCookies: true,
      },
    });

    return this.http
      .post<User>(this.baseUrl + 'login', values, {
        params,
      })
      .pipe(switchMap(() => this.getUserInfo()));
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http
      .get<User>(this.baseUrl + 'account/user-info')
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout() {
    return this.http
      .post<never>(this.baseUrl + 'account/logout', {})
      .pipe(tap(() => this.currentUser.set(null)));
  }

  updateAddress(address: Address) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  getAuthStatus() {
    return this.http.get(this.baseUrl + 'account/auth-status');
  }
}
