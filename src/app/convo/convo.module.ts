import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConvoPageRoutingModule } from './convo-routing.module';

import { ConvoPage } from './convo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConvoPageRoutingModule
  ],
  declarations: [ConvoPage]
})
export class ConvoPageModule {}
