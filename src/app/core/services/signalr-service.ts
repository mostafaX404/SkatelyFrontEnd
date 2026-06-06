import {Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../../environments/environments.dev';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    if (!this.hubConnection) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
        this.orderSignal.set(order);
      });
    }

    if (this.hubConnection.state === HubConnectionState.Disconnected) {
      this.hubConnection.start()
        .catch((error: any) => console.log(error));
    }
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error: any) => console.log(error));
    }
  }
}