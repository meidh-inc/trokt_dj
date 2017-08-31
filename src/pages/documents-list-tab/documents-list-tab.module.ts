import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsListTabPage } from './documents-list-tab';

@NgModule({
  declarations: [
    DocumentsListTabPage
  ],
  imports: [
    IonicPageModule.forChild(DocumentsListTabPage)
  ],
  exports: [
    DocumentsListTabPage
  ]
})
export class vDocumentsListTabPageModule {}
