import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertButton, AlertInput } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent  implements OnInit {
  @Input() label = ''
  @Input() hintText!: string
  @Input() errorText!: string
  @Input() selectorList: string[] = ['']
  @Input() value = ''
  @Output() valueChange = new EventEmitter<string>();
  trigger = (new Date().getTime() +  Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString()
  public alertButtons = [
    
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: (ev)=> {
        console.log(ev)
      }
    },
    {
      text: 'Ok',
      role: 'confirm',
      handler: (ev)=> {
        console.log(ev)
        if(ev){
          this.value = ev
        }
      }
    },
  ] as AlertButton[];
  
  constructor() { 
    //console.log(this.trigger)
  }

  ngOnInit() {
    console.log(this.selectorList,this.value)
  }

  getSelectorMap(){
    return this.selectorList.map(text => {
      return  {
        label: text,
        type: 'radio',
        value: text,
        
      } as AlertInput
    })
  }

}
