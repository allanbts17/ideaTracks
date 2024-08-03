import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.scss'],
})
export class TrackItemComponent implements OnInit {
  @Input() waveForm!: number[]
  @Input() audioSrc!: string
  percentages: string[] = []
  audioId: string
  playing = false
  audioPercent = 0
  constructor(private utils: UtilsService) {
    this.audioId = utils.makeId(5).toString()
  }

  ngOnInit() {
    let min = Math.min(...this.waveForm)
    let max = Math.max(...this.waveForm)
    this.percentages = this.waveForm.map(i => {
      let percent = this.linearInterpolation(min, 20, max, 100, i)
      return `${percent}%`
    })
    console.log(this.percentages)
  }

  playSong() {
    this.playing = true
    let audio = <HTMLAudioElement>document.getElementById(this.audioId)
    audio.play()
    audio.addEventListener('timeupdate', (data) => {
      this.audioPercent = audio.currentTime / audio.duration
      console.log(this.audioPercent * 100)
     // this.displayedCurrentTime = this.formatTime(<number>this.audio?.currentTime)
    })
  }

  stopSong() {
    this.playing = false
    let audio = <HTMLAudioElement>document.getElementById(this.audioId)
    audio.pause()
  }

  linearInterpolation(x0: number, y0: number, x1: number, y1: number, x: number): number {
    if (x1 === x0) {
      throw new Error("x0 and x1 cannot be the same value as it would result in division by zero.");
    }

    const y = y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    return y;
  }

}
