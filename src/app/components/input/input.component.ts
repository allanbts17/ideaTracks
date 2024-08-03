import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertButton, AlertInput } from '@ionic/angular';
import { Common } from 'src/app/shared/classes/common';
import { BackdropService } from 'src/app/shared/services/backdrop.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent  implements OnInit {
  @Input() label!: string
  @Input() values: string[] = []
  @Input() selected!: string
  @Output() selectedChange = new EventEmitter<string>();
  @ViewChild('container') container!: ElementRef;
  opened = false
  openerId: string
  onFocus = false
  constructor(private utils: UtilsService,
    private backdrop: BackdropService,
    private common: Common
  ) { 
    this.openerId = utils.makeId(5).toString()
    common.$navegationStart.subscribe(data => {
      this.opened = true
      this.openBox()
      console.log('exisitng')
    })
  }

  ngOnInit() { }


  selectItem(value: string) {
    this.selected = value
    this.selectedChange.emit(this.selected)
    this.openBox()
  }

  unSelectedValues(){
    return this.values//.filter(value => value != this.selected)
  }

  openBox() {
    this.opened = !this.opened
    let div: HTMLElement = <HTMLElement>document.getElementById(this.openerId)
    if (this.opened) {
      let items = this.values.length
      div.style.height = `${items * 48 + 2 + 48}px`
      console.log(this.container.nativeElement)
      this.backdrop.openBackdrop(this.container.nativeElement)
      this.backdrop.onTap = () => {
        this.openBox()
      }
    } else {
      div.style.height = '40px'
      this.backdrop.hideBackdrop(this.container.nativeElement)
    }

  }



}
