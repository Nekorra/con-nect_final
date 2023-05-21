import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvoPage } from './convo.page';

const routes: Routes = [
  {
    path: '',
    component: ConvoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConvoPageRoutingModule {}
