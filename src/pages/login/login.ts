import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { LoginService } from '../../providers/login.service';
import { StorageService } from '../../providers/storage.service';
import AuthUser from '../../models/auth-user';
import { ContactPage } from '../contact/contact';
import { IssueTabsPage } from '../issue-tabs/issue-tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private navCtrl: NavController, private formBuilder: FormBuilder, 
              private toastCtrl: ToastController, private loadingCtrl: LoadingController, 
              private loginService: LoginService, private storageService: StorageService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern('.+@.+')])],
      password: [null, Validators.required]
    });
  }

  login() {
    const loading: Loading = this.generateLoadingIndicator();
    loading.present();

    const user: AuthUser = new AuthUser(this.loginForm.value.email, this.loginForm.value.password);

    this.loginService.login(user)
      .subscribe(data => {
        loading.dismiss();
        this.storageService.storeAuthToken(data.token);
        this.storageService.storeUserId(data.user_id);
        this.loginForm.reset();
        this.navCtrl.setRoot(IssueTabsPage);
      }, err => {
        loading.dismiss();
        this.showToast('Invalid Email or Password');
      });
  }

  navigateToContactPage() {
    this.navCtrl.push(ContactPage);
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }

  generateLoadingIndicator() {
    return this.loadingCtrl.create({
      content: 'Signing In...'
    });
  }
}
