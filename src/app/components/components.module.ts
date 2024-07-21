import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './input/input.component';
import { FormsModule } from '@angular/forms';
import { TabComponent } from './tab/tab.component';

const items = [HeaderComponent,InputComponent,TabComponent]

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
