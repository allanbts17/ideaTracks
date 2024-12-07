import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class TrackItemComponent implements OnInit, OnChanges {
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



  async ngOnInit() {
    

  }

  async ngOnChanges(changes: SimpleChanges) {
    if(changes['audioSrc'].currentValue) {
      console.log('hi',changes['audioSrc'].currentValue,this.audioSrc)
      setTimeout(()=>{
        this.setTimeUpdate()
      },300)
      this.waveForm = await this.processAudioBase64(this.audioSrc)
      console.log(this.waveForm)
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
    //console.log('Changes detected:', changes);
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

  // processAudio(): Promise<number[]> {
  //   let audioElement = document.getElementById(this.audioId);
  //   console.log(audioElement)
  //   let audioContext = new window.AudioContext();
  //   let sourceUrl = audioElement?.querySelector('source')?.src as string | URL | Request;
  //   console.log('source',sourceUrl)
  //   return new Promise((resolve,reject)=>{
  //     fetch(sourceUrl)
  //     .then(response => response.arrayBuffer())
  //     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  //     .then(audioBuffer => {
  //       let quantizedData = this.quantizeAudioData(audioBuffer, 30);
  //       console.log(quantizedData);
  //       //quantizedData
  //       resolve(quantizedData);
  //     })
  //     .catch(error => {
  //       console.error('Error processing audio:', error)
  //       reject(error)
  //     });
  //   })
    
  // }

  processAudioBase64(base64Audio: string): Promise<number[]> {
    const audioContext = new window.AudioContext();

    return new Promise((resolve, reject) => {
        try {
            // Eliminar encabezado si existe
            const cleanBase64 = base64Audio.includes(',') ? base64Audio.split(',')[1] : base64Audio;

            // Convertir Base64 a ArrayBuffer
            const arrayBuffer = this.base64ToArrayBuffer(cleanBase64);

            // Decodificar el ArrayBuffer a AudioBuffer
            audioContext.decodeAudioData(arrayBuffer)
                .then(audioBuffer => {
                    // Cuantificar los datos del audio
                    const quantizedData = this.quantizeAudioData(audioBuffer, 30);
                    resolve(quantizedData);
                })
                .catch(error => {
                    console.error('Error procesando el audio:', error);
                    reject(error);
                });
        } catch (error) {
            console.error('Error general:', error);
            reject(error);
        }
    });
}

// Conversión Base64 a ArrayBuffer
private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}


  quantizeAudioData(buffer:any, numElements:any) {
    let data = buffer.getChannelData(0); // Obtener datos del canal izquierdo
    console.log('raw decoded data',data)
    let segmentLength = Math.floor(data.length / numElements);
    let quantizedData = [];

    for (let i = 0; i < numElements; i++) {
      let start = i * segmentLength;
      let end = start + segmentLength;
      let segment = data.slice(start, end);
      let sum = 0;

      for (let j = 0; j < segment.length; j++) {
        sum += Math.abs(segment[j]);
      }

      let avg = sum / segment.length;
      quantizedData.push(avg);
    }

    return quantizedData;
  }

}
