import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import Block from '../../models/block';

@IonicPage()
@Component({
  selector: 'page-block-details',
  templateUrl: 'block-details.html',
})
export class BlockDetailsPage {

  block: Block;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.block = navParams.get('block');
  }
}
