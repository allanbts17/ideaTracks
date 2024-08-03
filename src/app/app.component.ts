import { Component } from '@angular/core';
import { StorageService } from './shared/services/storage.service';
import { Common } from './shared/classes/common';
import { NavigationStart, Route, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private store: StorageService,
    private common: Common,
    private router: Router) {
      router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe(event => {
        common.$navegationStart.next(event)
        console.log('start',event)
      })
  }
  async ngOnInit() {
  
  }
}
