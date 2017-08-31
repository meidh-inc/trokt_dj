import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { StorageService } from './storage.service';

@Injectable()
export class HttpService {

  constructor(private http: Http, private storageService: StorageService) {}

  createAuthorizationHeader() {
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + this.storageService.getAuthToken());
    return headers;
  }

  get(url: string = '') {
    return this.http.get(`${url}&token=${this.storageService.getAuthToken()}`);
  }

  post(url: string = '', auth: boolean = false, data: object = {}) {
    if (auth) {
      return this.http.post(`${url}?token=${this.storageService.getAuthToken()}`, data);
    } else {
      return this.http.post(url, data);
    }
  }

  put(url: string = '', data: object = {}) {
    return this.http.put(url, data);
  }

  delete(url: string = '') {
    return this.http.delete(url);
  }

  static handleResponse(res: Response) {
    return res.json() || {};
  }

  static handleError(error: Response | any) {
    let body: object;
    if (error instanceof Response) {
      body = error.json() || '';
    } else {
      body = { error: 'Bad Request'};
    }
    return Observable.throw(body);
  }
}
