import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  onTap!: any
  constructor() { }

  openBackdrop(element: HTMLElement) {
    const backdrop = document.createElement('ion-backdrop');
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

  hideBackdrop(element: HTMLElement) {
    const backdrop = <HTMLElement>document.getElementsByTagName('ion-backdrop')[0]
    backdrop.style.opacity = '0'
    setTimeout(()=>{
      backdrop.remove()
      element.classList.remove('over-backdrop')
    },220)
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
