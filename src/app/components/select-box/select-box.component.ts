import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackdropService } from 'src/app/shared/services/backdrop.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements OnInit {
  @Input() values!: string[]
  @Input() selected!: string
  @Output() selectedChange = new EventEmitter<string>();
  opened = false
  openerId: string
  constructor(private utils: UtilsService,
    private backdrop: BackdropService
  ) { 
    this.openerId = utils.makeId(5).toString()
  }

  ngOnInit() { }


  selectItem(value: string) {
    this.selected = value
    this.selectedChange.emit(this.selected)
  }

  unSelectedValues(){
    return this.values.filter(value => value != this.selected)
  }

  openBox() {
    this.opened = !this.opened
    let div: HTMLElement = <HTMLElement>document.getElementById(this.openerId)
    if (this.opened) {
      let items = this.values.length
      div.style.height = `${items * 48 + 2}px`
      this.backdrop.openBackdrop()
    } else {
      div.style.height = '40px'
      this.backdrop.hideBackdrop()
    }

  }



}
