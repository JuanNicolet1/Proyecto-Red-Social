import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  tokenChanged = signal(false);

  notifyTokenUpdated() {
    this.tokenChanged.set(!this.tokenChanged());
  }
}