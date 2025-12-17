import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  hubUrl = environment.hubUrl;

  hubConnection?: HubConnection;

  order = signal<Order | null>(null);

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("OrderCompletedNotification", (order: Order) => {
      this.order.set(order);
    });
  }

  stopHubConnection() {
    if (this.hubConnection && this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection.stop().catch(error => console.log(error));
  }

  constructor() { }
}
