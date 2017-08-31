import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { StorageService } from './storage.service';
import { APIConstants } from '../constants/constants';

@Injectable()
export class DocumentService {

  constructor(private http: HttpService, private storageService: StorageService) {}

  getDocumentsForUser() {
    return this.http.get(`${APIConstants.apiUrl}cases?user_id=${this.storageService.getUserId()}`)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }

  searchForDocuments(text: string) {
    return this.http.get(`${APIConstants.apiUrl}cases/search?user_id=${this.storageService.getUserId()}&search_text=${text}`)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }
}
