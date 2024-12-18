import { Component, EventEmitter, Input, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { RecordingData } from 'src/app/shared/interfaces/song';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
})
export class TextItemComponent  implements OnInit {
  @Input() inputText: boolean = false
  @Input() text = ""
  @Input() item!: RecordingData
  @Input() textEvent = new EventEmitter<string>()
  @ViewChild('textArea') textArea!: ElementRef 
  @ViewChild('testContainer') testContainer!: ElementRef 
  @Output() textAddEvent = new EventEmitter<string>()
  showAddTextIcon = false
  constructor() { }

  ngOnInit() {}

  inputDetection(){
    if(this.text != "")
      this.showAddTextIcon = true
    else
      this.showAddTextIcon = false
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

  addText(){
    this.textAddEvent.emit(this.text)
    this.text = ""
    this.inputDetection()
    this.showAddTextIcon = false
  }

  saveChanges(){
    const invisibleCharRegex = /\u200B/;
    this.text = this.text.replace(invisibleCharRegex,'')
    this.item.text = this.text
  }

  detectInvisibleChar(): boolean {
    let text = this.item?.text
    // Expresión regular para detectar el espacio de ancho cero
    if(text){
      const invisibleCharRegex = /\u200B/;
      return invisibleCharRegex.test(text); // Devuelve true si encuentra el carácter
    } else {
      return false
    }

  }

}
