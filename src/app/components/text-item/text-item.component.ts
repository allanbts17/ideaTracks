import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
})
export class TextItemComponent  implements OnInit {
  @Input() inputText: boolean = false
  @Input() text = "Show the status bar. On iOS, if the status bar is initially hidden and the initial style is set to UIStatusBarStyleLightContent, first show call might present a glitch on the animation showing the text as dark and then transition to light. It's recommended to use Animation.None as the animation on the first call."
  @Input() textEvent = new EventEmitter<string>()
  constructor() { }

  ngOnInit() {}

}
