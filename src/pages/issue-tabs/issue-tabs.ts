import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'issue-tabs.html',
})
export class IssueTabsPage {

  newIssueTab = 'NewIssueTabPage';
  currentCasesTab = 'DocumentsListTabPage';

  constructor(private navCtrl: NavController, private navParams: NavParams) {}
}
