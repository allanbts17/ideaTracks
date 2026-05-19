import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent  implements OnInit {
  @Input() title = ''
  constructor() { }

  ngOnInit() {}

}
