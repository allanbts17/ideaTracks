import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/shared/classes/common';
import { Actions } from 'src/app/shared/classes/constans';
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
  menuOpened = false
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
    if(this.menuOpened) return
    let constainer = <HTMLElement>document.getElementById('tab-menu-container')
    let menu = <HTMLElement>constainer.getElementsByClassName('menu')[0]
    this.backdrop.openBackdrop(constainer)
    this.backdrop.onTap = () => {
      this.hideMenu()
    }
    menu.style.width = '60%'
    menu.style.height = '100px'
    menu.style.opacity = '1'
    this.menuOpened = true
  }

  centerImageAction(){
    if(this.common.centerImage == 'add'){
      this.showMenu()
    } else if((this.common.centerImage == 'rec')){
      let constainer = <HTMLElement>document.getElementById('tab-menu-container')
      this.backdrop.openBackdropWithCounter(constainer)
      this.common.changeCenterImage('stop')
      this.common.emitAction(Actions.START_AUDIO_REC)
    } else {
      this.common.changeCenterImage('rec')
      let constainer = <HTMLElement>document.getElementById('tab-menu-container')
      this.backdrop.hideBackdrop(constainer)
      this.common.emitAction(Actions.STOP_AUDIO_REC)
    }
  }

  hideMenu(){
    this.menuOpened = false
    let constainer = <HTMLElement>document.getElementById('tab-menu-container')
    let menu = <HTMLElement>constainer.getElementsByClassName('menu')[0]
    this.backdrop.hideBackdrop(constainer)
    menu.style.width = '30%'
    menu.style.height = '50px'
    menu.style.opacity = '0'
    this.backdrop.onTap = () => {
      //this.hideMenu()
    }
  }

  newSong(){
    this.hideMenu()
    this.tabs.forEach(tab => tab.selected = false)
    this.router.navigateByUrl('tabs/new-song')
  }

  newVideo(){
    this.hideMenu()
  }

}
