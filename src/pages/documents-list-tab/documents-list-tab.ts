import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import Document from '../../models/document';
import { DocumentService } from '../../providers/document.service';

@IonicPage()
@Component({
  selector: 'page-documents-list-tab',
  templateUrl: 'documents-list-tab.html',
})
export class DocumentsListTabPage implements OnInit {

  searchText: string = '';
  documents: Document[] = [];

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, 
              private keyboard: Keyboard, private iab: InAppBrowser, 
              private toastCtrl: ToastController, private documentService: DocumentService) {}

  ngOnInit() {
    this.getDocumentsForUser();
  }

  expandDocument(document: Document) {
    const browser = this.iab.create(document.url);
    browser.show();
  }

  searchInputBlur() {
    if (this.searchText) {
      this.searchForDocuments(this.searchText);
    } else {
      this.getDocumentsForUser();
    }
  }

  searchInputEnterTapped(event) {
    this.keyboard.close();
  }

  private getDocumentsForUser() {
    const loading = this.generateLoadingIndicator('Getting Documents...');
    loading.present();

    this.documentService.getDocumentsForUser()
      .subscribe(documents => {
        loading.dismiss();
        this.documents = documents.map(doc => new Document(doc.doc_id, doc.doc_name, doc.url));;
      }, err => {
        loading.dismiss();
        this.showToast('Unable to get documents. Please try again');
      });
  }

  private searchForDocuments(text: string) {
    const loading = this.generateLoadingIndicator('Searching Documents...');
    loading.present();

    this.documentService.searchForDocuments(text)
      .subscribe(documents => {
        loading.dismiss();
        this.documents = documents.map(doc => new Document(doc.doc_id, doc.doc_name, doc.url));;
      }, err => {
        loading.dismiss();
        this.showToast('Unable to search documents. Please try again');
      });
  }

  private showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }

  private generateLoadingIndicator(msg: string) {
    return this.loadingCtrl.create({
      content: msg
    });
  }
}
