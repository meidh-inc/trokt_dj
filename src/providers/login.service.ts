import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import  AuthUser from '../models/auth-user';
import { APIConstants } from '../constants/constants';

@Injectable()
export class LoginService {

  constructor(public http: HttpService) {}

  login(user: AuthUser) {
    return this.http.post(APIConstants.apiUrl + "auth", false, user)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }
}
