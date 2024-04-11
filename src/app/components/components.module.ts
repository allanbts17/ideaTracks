import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from './input/input.component';
import { FormsModule } from '@angular/forms';

const items = [HeaderComponent,InputComponent]

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
