import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabComponent  implements OnInit {
  @Input() type!: 'home'|'mix'|'ryhms'|'synonyms'
  selected = false
  constructor() { }

  ngOnInit() {}

}
