import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {

  constructor() { }

  openBackdrop(){
    let backdrop: HTMLElement = <HTMLElement>document.getElementById("tabs-backdrop")
    backdrop.style.opacity = '30%'
    backdrop.style.visibility = 'visible'
    console.log(backdrop)
  }

  hideBackdrop(){
    let backdrop: HTMLElement = <HTMLElement>document.getElementById("tabs-backdrop")
    backdrop.style.opacity = '0%'
    backdrop.style.visibility = 'hidden'
  }
}
