import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
      selected: false
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
  constructor(private router: Router) {}

  selectTab(tab: Tab){
    console.log(tab)
    this.tabs.forEach(tab => tab.selected = false)
    tab.selected = true
    this.router.navigateByUrl(tab.path)
  }

}
