import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'new-song',
        loadChildren: () => import('../new-song/new-song.module').then( m => m.NewSongPageModule)
      },
      {
        path: 'config',
        loadChildren: () => import('../config/config.module').then( m => m.ConfigPageModule)
      },
      {
        path: 'mix',
        loadChildren: () => import('../mix/mix.module').then( m => m.MixPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
