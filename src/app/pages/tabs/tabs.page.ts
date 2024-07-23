import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/shared/classes/common';

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
  constructor(private router: Router, private common: Common) {
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

}
