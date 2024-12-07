import { Injectable } from '@angular/core';
import { Song } from '../interfaces/song';
import { Subject } from 'rxjs';
import { Actions } from './constans';

type CenterImageType = 'add'|'rec'|'stop'
@Injectable({
  providedIn: 'root'
})
export class Common {
  // Song Data
  categories: string[] =[]
  songs: string[] = []
  recordingData: Song[] = []
  selectedSong!: Song

  $navegationStart: Subject<any> = new Subject<any>
  centerImage!: CenterImageType
  $actions: Subject<Actions> = new Subject<Actions>

  changeCenterImage(image: CenterImageType){
    let targetImage = <HTMLElement>document.getElementById(`${image}Icon`)
    targetImage.style.opacity = "1"
    if(this.centerImage){
      let actualImage = <HTMLElement>document.getElementById(`${this.centerImage}Icon`)
      actualImage.style.opacity = "0"
      console.log('hiding',`${this.centerImage}Icon`,actualImage)
    }

    console.log('showing',`${image}Icon`,targetImage)
    
    // console.log(this.centerImage,image)
    // console.log(targetImage,actualImage)
    this.centerImage = image
  }

  emitAction(action: Actions){
    this.$actions.next(action)
  }

  

}
