import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, User } from '../../shared/models/user';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private signalr = inject(SignalrService);
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
      .pipe(switchMap(() => this.getUserInfo()))
      .pipe(tap(() => this.signalr.createHubConnection()));
  }

  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http
      .get<User>(this.baseUrl + 'account/user-info')
      .pipe(tap((user) =>
        this.currentUser.set(user)
      ));
  }

  logout() {
    return this.http
      .post<never>(this.baseUrl + 'account/logout', {})
      .pipe(tap(() => this.currentUser.set(null)))
      .pipe(tap(() => this.signalr.stopHubConnection()));
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(tap(
      () => this.currentUser.update(user => {
        if (user) {
          user.address = address;
        }
        return user;
      })
    ));
  }

  getAuthStatus() {
    return this.http.get(this.baseUrl + 'account/auth-status');
  }
}
