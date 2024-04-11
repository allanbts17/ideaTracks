import { Component } from '@angular/core';
import { StorageService } from './shared/services/storage.service';
import { Common } from './shared/classes/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private store: StorageService, private common: Common) {}
  async ngOnInit() {
  
  }
}
