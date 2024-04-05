import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';

const items = [HeaderComponent]

@NgModule({
  declarations: [items],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [items]
})
export class ComponentsModule { }
