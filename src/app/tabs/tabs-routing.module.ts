import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import("../home/home.module").then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'chat',
        loadChildren: () => import("../chat/chat.module").then(m => m.ChatPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import("../profile/profile.module").then(m => m.ProfilePageModule)
      },
      {
        path: 'find',
        loadChildren: () => import("../find/find.module").then(m => m.FindPageModule)
      },
      {
        path: 'convo',
        loadChildren: () => import("../convo/convo.module").then(m => m.ConvoPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tabs/home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
