import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecordingData } from 'src/app/shared/interfaces/song';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
})
export class SongItemComponent  implements OnInit {
  @Input() title!: string
  @Input() tracks!: RecordingData[]
  trackText!: string
  constructor(private router: Router) { }

  ngOnInit() {
    //this.trackText = `${this.tracks.toString()} ${this.tracks == 1? 'pista':'pistas'}`
  }

  getTracksQuantity(){
    let filtered = this.tracks.filter((d => d.path)) || []
    return `${filtered.length.toString()} ${filtered.length == 1? 'pista':'pistas'}`
     
  }

  navigate(){
    
  }

}
