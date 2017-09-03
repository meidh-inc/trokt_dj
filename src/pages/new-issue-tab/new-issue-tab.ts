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
  formIsValid: boolean = false;

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

    this.issueForm.controls.document_id.disable();
    this.issueForm.controls.block_id.disable();
    this.blockHasText = false;
    this.issueForm.patchValue({ document_id: null, block_id: null });
    this.getDocumentsForUser(this.issueForm.value.group_id);
    this.isFormValid();
  }

  documentChanged() {
    if (!this.issueForm.value.document_id) {
      return;
    }

    this.issueForm.controls.block_id.disable();
    this.blockHasText = false;
    this.issueForm.patchValue({ block_id: null });
    this.getDocumentBlocksForUser(this.issueForm.value.document_id);
    this.isFormValid();
  }

  blockChanged() {
    if (!this.issueForm.value.block_id) {
      return;
    }
    
    const block = this.getBlock(this.blocks, this.issueForm.value.block_id);
    this.blockHasText = (block && block.block_text && block.block_text !== '');
    this.isFormValid();
  }

  detailsChanged() {
    this.isFormValid();
  }

  viewBlockDetails() {
    if (!this.issueForm.value.block_id) {
      return;
    }
    const block = this.getBlock(this.blocks, this.issueForm.value.block_id);
    this.modalCtrl.create('BlockDetailsPage', { block }).present();
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
        this.isFormValid();
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
          if (this.groups.length === 1) {
            const groupId = this.groups[0].group_id;
            this.issueForm.patchValue({group_id: groupId});
            this.getDocumentsForUser(groupId);
          }
        } else {
          this.showToast('You have no groups available.');
          this.documents = [];
          this.blocks = [];
          this.blockHasText = false;
          this.issueForm.controls.group_id.disable();
          this.issueForm.controls.doc_id.disable();
          this.issueForm.controls.block_id.disable();
        }
      }, err => {
        loading.dismiss();
        this.showToast('Unable to load groups. Please try again');
      });
  }

  private getDocumentsForUser(groupId: number) {
    const loading = this.generateLoadingIndicator('Getting Documents...');
    loading.present();
    this.issueService.getDocumentsForUser(groupId)
      .subscribe(documents => {
        this.documents = documents.map(doc => new Document(doc.doc_id, doc.doc_name, doc.url));
        loading.dismiss();
        if (!this.isDisabled(this.documents)) {
          this.issueForm.controls.document_id.enable();
          if (this.documents.length === 1) {
            const docId = this.documents[0].doc_id;
            this.issueForm.patchValue({document_id: docId});
            this.getDocumentBlocksForUser(docId);
          }
        } else {
          this.showToast('This group has no documents.');
          this.blocks = [];
          this.blockHasText = false;
          this.issueForm.controls.document_id.disable();
          this.issueForm.controls.block_id.disable();
        }
      }, err => {
        loading.dismiss();
        this.showToast('Unable to load documents. Please try again');
      });
  }

  private getDocumentBlocksForUser(documentId: number) {
    const loading = this.generateLoadingIndicator('Getting Sections...');
    loading.present();
    this.issueService.getDocumentBlocksForUser(documentId)
      .subscribe(blocks => {
        this.blocks = blocks.map(block => new Block(block.block_id, block.block_title, block.block_text));
        loading.dismiss();
        if (!this.isDisabled(this.blocks)) {
          this.issueForm.controls.block_id.enable();
        } else {
          this.issueForm.controls.block_id.disable();
          this.blockHasText = false;
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

  private isFormValid() {
    this.formIsValid = this.issueForm.value.group_id &&
                       this.issueForm.value.document_id &&
                       this.issueForm.value.block_id &&
                       this.issueForm.value.details;
  }

  private getBlock = (blocks, blockId) => blocks.find(block => block.block_id === parseInt(blockId));
  private isDisabled = (list) => (!list || list.length === 0);
  private generateLoadingIndicator = (msg: string) => this.loadingCtrl.create({content: msg});

  private showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }
}
