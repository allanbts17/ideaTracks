import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
})
export class SongItemComponent  implements OnInit {
  @Input() title!: string
  @Input() tracks!: number
  trackText!: string
  constructor(private router: Router) { }

  ngOnInit() {
    this.trackText = `${this.tracks.toString()} ${this.tracks == 1? 'pista':'pistas'}`
  }

  navigate(){
    
  }

}
