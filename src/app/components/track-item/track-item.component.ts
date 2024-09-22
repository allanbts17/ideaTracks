import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { UtilsService } from 'src/app/shared/services/utils.service';

interface PercentageData {
  percent: string;
  active: boolean;
}

@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.scss'],
})
export class TrackItemComponent implements OnInit {
  @Input() waveForm!: number[]
  @Input() audioSrc!: string
  @ViewChild('slider', { read: ElementRef }) slider!: ElementRef<HTMLElement>;
  @ViewChild('trackAudio', { read: ElementRef }) audio!: ElementRef<HTMLAudioElement>;

  percentages: PercentageData[] = []
  audioId: string
  playing = false
  audioPercent = 0
  currentTime = '0:00'
  totalTime = '0:00'
  timeUpdateSetted = false
  constructor(private utils: UtilsService, private el: ElementRef, private gestureCtrl: GestureController) {
    this.audioId = utils.makeId(5).toString()
  }

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.slider.nativeElement,
      onStart: (det) => this.startTouch(det),
      onMove: (detail) => this.dragging(detail),
      onEnd: (det) => this.endTouch(det),
      gestureName: 'example',
    });
    //console.log(gesture)

    //gesture.enable();
    setTimeout(() => {
      console.log(gesture)
      gesture.enable();
    });
  }

  itemOnAudioAdvance(index: number) {
    let num = this.linearInterpolation(0, 0, 100, this.waveForm.length, this.audioPercent)
    //console.log(num,this.waveForm.length,this.audioPercent)
    return index < Math.round(num)
  }

  formatTime(total: number) {
    let minutes = Math.floor(total / 60);
    let seconds = Math.floor(total % 60);
    let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    return '' + minutes + ':' + formattedSeconds
  }



  ngOnInit() {
    setTimeout(()=>{
      this.setTimeUpdate()
    },300)
    let min = Math.min(...this.waveForm)
    let max = Math.max(...this.waveForm)
    this.percentages = this.waveForm.map(i => {
      let _percent = this.linearInterpolation(min, 20, max, 100, i)
      return {
        percent: `${_percent}%`,
        active: false
      }
    })
    console.log(this.percentages)
    setTimeout(() => {
      this.totalTime = this.formatTime(this.audio.nativeElement.duration)
    }, 500);

  }

  startTouch(ev: any) {
    //console.log('touch',ev)
  }

  endTouch(ev: any) {
    //console.log('end',ev)

  }

  setTimeUpdate() {
    if (!this.timeUpdateSetted) {
      this.timeUpdateSetted = true
      this.audio.nativeElement.addEventListener('timeupdate', (data) => {
        this.currentTime = this.formatTime(this.audio.nativeElement.currentTime)
        this.audioPercent = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration * 100
        console.log(this.audioPercent)
        this.percentages.forEach((data, index) => {
          data.active = this.itemOnAudioAdvance(index)
        })
      })
    }

  }

  onClick(ev: any) {
    console.log('click', ev)
    const rect = this.slider.nativeElement.getBoundingClientRect();
    let draggingX = ev.x
    draggingX = Math.max(rect.left, draggingX)
    draggingX = Math.min(rect.left + rect.width, draggingX)
    this.audio.nativeElement.currentTime = this.linearInterpolation(rect.left, 0, rect.left + rect.width, this.audio.nativeElement.duration, draggingX)
    this.audioPercent = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration * 100
    this.percentages.forEach((data, index) => {
      data.active = this.itemOnAudioAdvance(index)
    })

    console.log(this.percentages.map(pe => pe.active))
  }

  dragging(ev: any) {
    console.log('dragging', ev)
    // this.audio.nativeElement.play().then(()=>{
    //   this.audio.nativeElement.pause()
    // })


    const rect = this.slider.nativeElement.getBoundingClientRect();
    let draggingX = ev.currentX
    draggingX = Math.max(rect.left, draggingX)
    draggingX = Math.min(rect.left + rect.width, draggingX)
    this.audio.nativeElement.currentTime = this.linearInterpolation(rect.left, 0, rect.left + rect.width, this.audio.nativeElement.duration, draggingX)
    this.audioPercent = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration * 100
    this.percentages.forEach((data, index) => {
      data.active = this.itemOnAudioAdvance(index)
    })
    console.log(this.percentages)
    console.log(this.percentages.map(pe => pe.active))
  }

  playSong() {

    this.playing = true

    this.audio.nativeElement.play()
    // this.audio.nativeElement.addEventListener('timeupdate', (data) => {
    //   this.currentTime = this.formatTime(this.audio.nativeElement.currentTime)
    //   this.audioPercent = this.audio.nativeElement.currentTime / this.audio.nativeElement.duration * 100
    //   console.log(this.audioPercent)
    //   this.percentages.forEach((data,index) => {
    //     data.active = this.itemOnAudioAdvance(index)
    //   })
    // })
  }

  stopSong() {

    this.playing = false
    this.audio.nativeElement.pause()
  }

  linearInterpolation(x0: number, y0: number, x1: number, y1: number, x: number): number {
    if (x1 === x0) {
      throw new Error("x0 and x1 cannot be the same value as it would result in division by zero.");
    }

    const y = y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    return y;
  }

}
