import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  onTap!: any
  constructor() { }

  openBackdrop(element: HTMLElement) {
    const backdrop = document.createElement('ion-backdrop');
    backdrop.id = 'custom-backdrop'
    element.parentNode?.insertBefore(backdrop,element.nextSibling)
    element.classList.add('over-backdrop')
    setTimeout(()=> {
      backdrop.style.opacity = '0.3'
    })
    backdrop.addEventListener('ionBackdropTap',(ev)=>{
      console.log('clicked',ev)
      this.onTap()
    })
  }

  hideBackdrop(element: HTMLElement, deleteTime = 200) {
    const backdrop = <HTMLElement>document.getElementById('custom-backdrop')
    console.log(backdrop,document.getElementsByTagName('ion-backdrop'))
    backdrop.style.opacity = '0'
    setTimeout(()=>{
      backdrop.remove()
      element.classList.remove('over-backdrop')
    },deleteTime + 20)
  }

  // createSiblingElement() {
  //   // Crear un nuevo elemento div
  //   const backdrop = document.createElement('ion-backdrop');
  //   newDiv.textContent = 'This is a new sibling div';
  //   newDiv.style.backgroundColor = 'lightblue';
  //   newDiv.style.marginTop = '10px';

  //   // Insertar el nuevo div después del targetDiv
  //   this.targetDiv.nativeElement.parentNode.insertBefore(newDiv, this.targetDiv.nativeElement.nextSibling);
  // }
}
