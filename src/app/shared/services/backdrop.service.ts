import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  onTap!: any
  private haveCounter = false
  private timerSubscription: Subscription | undefined;
  constructor() { }

  openBackdrop(element: HTMLElement) {
    const backdrop = document.createElement('ion-backdrop');
    backdrop.id = 'custom-backdrop'
    element.parentNode?.insertBefore(backdrop, element.nextSibling)
    element.classList.add('over-backdrop')
    setTimeout(() => {
      backdrop.style.opacity = '0.3'
    })
    backdrop.addEventListener('ionBackdropTap', (ev) => {
      console.log('clicked', ev)
      this.onTap()
    })
  }

  openBackdropWithCounter(element: HTMLElement) {
    this.haveCounter = true
    const backdrop = document.createElement('ion-backdrop');
    const counter = document.createElement("div")
    counter.id = "backdrop-counter"
    counter.innerText = "00:00"
    

    function formatSecondsToTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60); // Calcula los minutos
      const remainingSeconds = seconds % 60;  // Calcula los segundos restantes

      // Formatea los minutos y segundos con dos dígitos
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

      return `${formattedMinutes}:${formattedSeconds}`;
    }

    this.timerSubscription = interval(1000).subscribe(data => {
      console.log(formatSecondsToTime(data + 1))
      counter.innerText = formatSecondsToTime(data + 1)
    })

    backdrop.id = 'custom-backdrop'
    element.parentNode?.insertBefore(counter, element.nextSibling)
    element.parentNode?.insertBefore(backdrop, element.nextSibling)
    element.classList.add('over-backdrop')
    setTimeout(() => {
      backdrop.style.opacity = '0.6'
    })
    backdrop.addEventListener('ionBackdropTap', (ev) => {
      console.log('clicked', ev)
      this.onTap()
    })
  }

  hideBackdrop(element: HTMLElement, deleteTime = 200) {
    const backdrop = <HTMLElement>document.getElementById('custom-backdrop')
    console.log(backdrop, document.getElementsByTagName('ion-backdrop'))
    backdrop.style.opacity = '0'
    if (this.haveCounter) {
      const counter = <HTMLElement>document.getElementById('backdrop-counter')
      counter.style.opacity = '0'
    }
    setTimeout(() => {
      backdrop.remove()
      element.classList.remove('over-backdrop')
      if (this.haveCounter) {
        const counter = <HTMLElement>document.getElementById('backdrop-counter')
        counter.remove()
        this.haveCounter = false
        this.timerSubscription?.unsubscribe()
      }
    }, deleteTime + 20)
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
