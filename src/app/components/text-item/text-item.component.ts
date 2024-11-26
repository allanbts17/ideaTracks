import { Component, EventEmitter, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
})
export class TextItemComponent  implements OnInit {
  @Input() inputText: boolean = false
  @Input() text = `Show the status bar. On iOS, if the status bar is initially hidden and the initial style is set to UIStatusBarStyleLightContent, first show call might present a glitch on the animation showing the text as dark and then transition to light. It's recommended to use Animation.None as the animation on the first call.`
  @Input() textEvent = new EventEmitter<string>()
  @ViewChild('textArea') textArea!: ElementRef 
  @ViewChild('testContainer') testContainer!: ElementRef 
  constructor() { }

  ngOnInit() {}

  inputDetection(){
    let test: HTMLElement = this.testContainer.nativeElement
    let textArea: HTMLElement = this.textArea.nativeElement
    let testParent: HTMLElement = test.parentElement as HTMLElement
    testParent.style.width = textArea.parentElement?.clientWidth.toString() + 'px'
    setTimeout(()=>{
      let height = test.clientHeight
      console.log(height)
      if(height >= 47)
        textArea.style.height = height.toString() + 'px'
      else
        textArea.style.height = '47px'
    })
    
  }

}
