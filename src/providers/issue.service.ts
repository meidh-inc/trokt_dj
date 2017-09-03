import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Issue from '../models/issue';
import { StorageService } from './storage.service';
import { APIConstants } from '../constants/constants';

@Injectable()
export class IssueService {

  constructor(private http: HttpService, private storageService: StorageService) {}

  getGroupsForUser() {
    return this.http.get(`${APIConstants.apiUrl}groups?user_id=${this.storageService.getUserId()}`)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }

  getDocumentsForUser(groupId: number) {
    return this.http.get(`${APIConstants.apiUrl}docs?user_id=${this.storageService.getUserId()}&group_id=${groupId}`)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }

  getDocumentBlocksForUser(docId: number) {
    return this.http.get(`${APIConstants.apiUrl}blocks?doc_id=${docId}&user_id=${this.storageService.getUserId()}`)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }

  submitIssue(issue: Issue) {
    return this.http.post(`${APIConstants.apiUrl}issue`, true, issue)
      .map(HttpService.handleResponse)
      .catch(HttpService.handleError);
  }
}
