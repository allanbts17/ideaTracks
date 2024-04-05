import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSongPage } from './new-song.page';

const routes: Routes = [
  {
    path: '',
    component: NewSongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSongPageRoutingModule {}
