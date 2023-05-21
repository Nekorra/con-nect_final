import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindPageRoutingModule } from './find-routing.module';

import { FindPage } from './find.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindPageRoutingModule
  ],
  declarations: [FindPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FindPageModule {}
