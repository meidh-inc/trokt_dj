import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockDetailsPage } from './block-details';

@NgModule({
  declarations: [
    BlockDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockDetailsPage),
  ],
  exports: [
    BlockDetailsPage
  ]
})
export class BlockDetailsPageModule {}
