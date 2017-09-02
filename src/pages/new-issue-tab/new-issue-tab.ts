import { Component,OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, ToastController, LoadingController, ModalController } from 'ionic-angular';

import { IssueService } from '../../providers/issue.service';
import { StorageService } from '../../providers/storage.service';
import Group from '../../models/group';
import Document from '../../models/document';
import Block from '../../models/block';
import Issue from '../../models/issue';

@IonicPage()
@Component({
  selector: 'page-new-issue-tab',
  templateUrl: 'new-issue-tab.html',
})
export class NewIssueTabPage implements OnInit {

  issueForm: FormGroup;
  groups: Group[] = [];
  documents: Document[] = [];
  blocks: Block[] = [];
  blockHasText: boolean = false;

  constructor(private formBuilder: FormBuilder, private issueService: IssueService,
              private storageService: StorageService, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.initializeForm();
    this.getGroupsForUser();
  }

  groupChanged() {
    if (!this.issueForm.value.group_id) {
      return;
    }
    this.getDocumentsForUser(this.issueForm.value.group_id);
  }

  documentChanged() {
    if (!this.issueForm.value.document_id) {
      return;
    }
    this.getDocumentBlocksForUser(this.issueForm.value.document_id);
  }

  blockChanged() {
    if (!this.issueForm.value.block_id) {
      return;
    }
    const block = this.blocks.find(block => block.block_id === parseInt(this.issueForm.value.block_id));
    this.blockHasText = (block.block_text && block.block_text !== '');
  }

  viewBlockDetails() {
    if (!this.issueForm.value.block_id) {
      return;
    }
    const block = this.blocks.find(block => block.block_id === parseInt(this.issueForm.value.block_id));
    const detailsModal = this.modalCtrl.create('BlockDetailsPage', { block });
    detailsModal.present();
  }

  submitIssue() {
    const loading = this.generateLoadingIndicator('Submitting Issue...');
    loading.present();
    const userId: number = this.storageService.getUserId() ? parseInt(this.storageService.getUserId()) : null;
    const issue: Issue = new Issue(this.issueForm.value.group_id,
                                   this.issueForm.value.document_id,
                                   this.issueForm.value.block_id,
                                   userId,
                                   this.issueForm.value.details);
    this.issueService.submitIssue(issue)
      .subscribe(result => {
        loading.dismiss();
        this.showToast('Success! Thank you for raising this issue.');
        this.resetForm();
      }, err => {
        loading.dismiss();
        this.showToast('Something went wrong. Please try again');
      });
  }

  private getGroupsForUser() {
    const loading = this.generateLoadingIndicator('Getting Groups...');
    loading.present();
    this.issueService.getGroupsForUser()
      .subscribe(groups => {
        this.groups = groups.map(group => new Group(group.group_id, group.group_name));
        loading.dismiss();
        if (!this.isDisabled(this.groups)) {
          this.issueForm.controls.group_id.enable();
        } else {
          this.showToast('You have no groups available.');
          this.issueForm.controls.group_id.disable();
        }
      }, err => {
        loading.dismiss();
        this.showToast('Unable to load groups. Please try again');
      });
  }

  private getDocumentsForUser(groupId: string) {
    const loading = this.generateLoadingIndicator('Getting Documents...');
    loading.present();
    this.issueService.getDocumentsForUser(groupId)
      .subscribe(documents => {
        this.documents = documents.map(doc => new Document(doc.doc_id, doc.doc_name, doc.url));
        loading.dismiss();
        if (!this.isDisabled(this.documents)) {
          this.issueForm.controls.document_id.enable();
        } else {
          this.showToast('This group has no documents.');
          this.issueForm.controls.document_id.disable();
        }
      }, err => {
        loading.dismiss();
        this.showToast('Unable to load documents. Please try again');
      });
  }

  private getDocumentBlocksForUser(documentId: string) {
    const loading = this.generateLoadingIndicator('Getting Sections...');
    loading.present();
    this.issueService.getDocumentBlocksForUser(documentId)
      .subscribe(blocks => {
        this.blocks = blocks.map(block => new Block(block.block_id, block.block_title, block.block_text));
        loading.dismiss();
        if (!this.isDisabled(this.blocks)) {
          this.issueForm.controls.block_id.enable();
        } else {
          this.showToast('This document has no sections.');
        }
      }, err => {
        loading.dismiss();
        this.showToast('Unable to load sections. Please try again');
      });
  }

  private initializeForm() {
    this.issueForm = this.formBuilder.group({
      group_id: [{value: null, disabled: this.isDisabled(this.groups)}, Validators.required],
      document_id: [{value: null, disabled: this.isDisabled(this.documents)}, Validators.required],
      block_id: [{value: null, disabled: this.isDisabled(this.blocks)}, Validators.required],
      details: [null, Validators.required]
    });
  }

  private resetForm() {
    this.documents = [];
    this.blocks = [];
    this.blockHasText = false;
    this.initializeForm();
    setTimeout(() => {
      this.issueForm.controls.document_id.disable();
      this.issueForm.controls.block_id.disable();
    }, 0);
  }

  private isDisabled(list) {
    return (!list || list.length === 0);
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
