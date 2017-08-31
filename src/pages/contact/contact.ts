import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import Contact from '../../models/contact';

import { ContactService } from '../../providers/contact.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage implements OnInit {

  contactForm: FormGroup;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController, 
              private loadingCtrl: LoadingController, private formBuilder: FormBuilder, 
              private contactService: ContactService) {}

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      group_name: [null, Validators.required],
      user_email: [null, Validators.compose([Validators.required, Validators.pattern('.+@.+')])]
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  submit() {
    const loading: Loading = this.generateLoadingIndicator();
    loading.present();

    const contact: Contact = new Contact(this.contactForm.value.user_email, this.contactForm.value.group_name);

    this.contactService.contact(contact)
      .subscribe(result => {
        loading.dismiss();
        this.contactForm.reset();
        this.displayToast("Message is on its way!");
      }, err => {
        loading.dismiss();
        this.displayToast("Something went wrong. Please try again.");
      });
  }

  displayToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }

  generateLoadingIndicator() {
    return this.loadingCtrl.create({
      content: 'Contacting Trokt...'
    });
  }
}

