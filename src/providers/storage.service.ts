import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageService{

  constructor(public http: Http) {}

  storeAuthToken(token: string) {
    window.sessionStorage.setItem('token', token);
  }

  getAuthToken(): string | undefined {
    return window.sessionStorage.getItem('token');
  }

  storeUserId(id: string) {
    window.sessionStorage.setItem('userId', id);
  }

  getUserId(): string | undefined {
    return window.sessionStorage.getItem('userId');
  }
}
