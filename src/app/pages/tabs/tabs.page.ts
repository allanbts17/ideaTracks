import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/shared/classes/common';
import { BackdropService } from 'src/app/shared/services/backdrop.service';

interface Tab {
  label: string;
  icon:  'home'|'mix'|'ryhms'|'synonyms';
  path: string;
  selected: boolean;
}
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tabs: Tab[] = [
    {
      label: "Inicio",
      icon: "home",
      path: "tabs/home",
      selected: true
    },
    {
      label: "Mezcla",
      icon: "mix",
      path: "tabs/mix",
      selected: false
    },
    {
      label: "Rimas",
      icon: "ryhms",
      path: "",
      selected: false
    },
    {
      label: "Sinónimos",
      icon: "synonyms",
      path: "",
      selected: false
    }
  ]
  constructor(private router: Router,
    private common: Common,
    private backdrop: BackdropService) {
  }

  selectTab(tab: Tab){
    console.log(tab)
    this.tabs.forEach(tab => tab.selected = false)
    tab.selected = true
    this.router.navigateByUrl(tab.path)
  }

  tabBackdrop(ev: any){
    console.log(ev)
  }

  showMenu(){
    let constainer = <HTMLElement>document.getElementById('tab-menu-container')
    let menu = <HTMLElement>constainer.getElementsByClassName('menu')[0]
    this.backdrop.openBackdrop(constainer)
    this.backdrop.onTap = () => {
      this.hideMenu()
    }
    menu.style.width = '60%'
    menu.style.height = '100px'
    menu.style.opacity = '1'
  }

  hideMenu(){
    let constainer = <HTMLElement>document.getElementById('tab-menu-container')
    let menu = <HTMLElement>constainer.getElementsByClassName('menu')[0]
    this.backdrop.hideBackdrop(constainer, 250)
    menu.style.width = '30%'
    menu.style.height = '50px'
    menu.style.opacity = '0'
  }

  newSong(){
    this.hideMenu()
  }

  newVideo(){
    this.hideMenu()
  }

}
