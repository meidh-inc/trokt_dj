import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';

import { RootComponent } from './app.component';

import { HttpService } from '../providers/http.service';
import { LoginService } from '../providers/login.service';
import { ContactService } from '../providers/contact.service';
import { StorageService } from '../providers/storage.service';
import { IssueService } from '../providers/issue.service';
import { DocumentService } from '../providers/document.service';

import { LoginPage } from '../pages/login/login';
import { ContactPage } from '../pages/contact/contact';
import { IssueTabsPage } from '../pages/issue-tabs/issue-tabs';

@NgModule({
  declarations: [
    RootComponent,
    LoginPage,
    ContactPage,
    IssueTabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(RootComponent),
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootComponent,
    LoginPage,
    ContactPage,
    IssueTabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpService,
    LoginService,
    ContactService,
    StorageService,
    IssueService,
    DocumentService
  ]
})
export class AppModule {}
