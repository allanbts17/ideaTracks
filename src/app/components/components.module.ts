import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './input/input.component';
import { FormsModule } from '@angular/forms';
import { TabComponent } from './tab/tab.component';
import { SelectBoxComponent } from './select-box/select-box.component';
import { SongItemComponent } from './song-item/song-item.component';
import { TrackItemComponent } from './track-item/track-item.component';

const items = [
  HeaderComponent,
  InputComponent,
  TabComponent,
  SelectBoxComponent,
  HeaderComponent,
  SongItemComponent,
  TrackItemComponent
]

@NgModule({
  declarations: [items],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [items]
})
export class ComponentsModule { }
