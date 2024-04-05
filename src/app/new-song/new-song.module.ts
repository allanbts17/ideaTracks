import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSongPageRoutingModule } from './new-song-routing.module';

import { NewSongPage } from './new-song.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NewSongPageRoutingModule
  ],
  declarations: [NewSongPage]
})
export class NewSongPageModule {}
