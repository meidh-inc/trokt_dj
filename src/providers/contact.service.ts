import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Contact from '../models/contact';
import { APIConstants } from '../constants/constants';

@Injectable()
export class ContactService {

  constructor(public http: HttpService) {}

    contact(contact: Contact) {
      return this.http.post(APIConstants.apiUrl + "contact", false, contact)
        .map(HttpService.handleResponse)
        .catch(HttpService.handleError); 
    }
}
