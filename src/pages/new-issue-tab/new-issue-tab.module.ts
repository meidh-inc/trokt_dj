import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewIssueTabPage } from './new-issue-tab';

@NgModule({
  declarations: [
    NewIssueTabPage
  ],
  imports: [
    IonicPageModule.forChild(NewIssueTabPage)
  ],
  exports: [
    NewIssueTabPage
  ]
})
export class NewIssueTabPageModule {}
