import { Component, OnInit } from '@angular/core';
import { Microphone, AudioRecording, PermissionStatus, MicrophonePermissionStateValue } from '@mozartec/capacitor-microphone';
import { RecordingData, Song } from 'src/app/shared/interfaces/song';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Filesystem, Directory, Encoding, WriteFileResult, ReadFileResult } from '@capacitor/filesystem';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Actions, DEFAULT_FOLDER, FOLDERS_PATH, MAIN_DIRECTORY, RECORDINGS_PATH, SONGS_PATH } from 'src/app/shared/classes/constans';
import { TimerService } from 'src/app/shared/services/timer.service';
import { Common } from 'src/app/shared/classes/common';
import { Router } from '@angular/router';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Subscription } from 'rxjs';
//var Ffmpeg = require('fluent-ffmpeg');
//import * as Ffmpeg from 'fluent-ffmpeg'
@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.page.html',
  styleUrls: ['./new-song.page.scss'],
})
export class NewSongPage implements OnInit {
  recording!: AudioRecording;
  recordingData: RecordingData[] = []
  //  [{
  //   text: ''
  // }]
  isRecording = false


  category = DEFAULT_FOLDER
  songName = ''
  songData!: Song
  oldSongname!: string
  disableReorder = true
  deletedAudio: RecordingData[] = []
  actionSubscription!: Subscription
  testSong = [
    0.016184531151553397,
    0.017841611180880172,
    0.018356713905199204,
    0.013041050548682797,
    0.020262153866186104,
    0.023508937079115885,
    0.013171334686182251,
    0.021165847530217715,
    0.012415849609698928,
    0.013206741199543385,
    0.0164722133304893,
    0.03549864487474137,
    0.020968917799951265,
    0.020279958571054836,
    0.031368221840458906,
    0.021655172599104027,
    0.01450641636444283,
    0.02383029605817379,
    0.023624907240969713,
    0.030823091214946426,
    0.02516797873818801,
    0.021577931395630186,
    0.014101950122663055,
    0.021328477368930752,
    0.020846696949449604,
    0.01204162583980004,
    0.020173511332888548,
    0.0149811039126119,
    0.0045874016653475475,
    0.0002507525880836647
]

  constructor(private loading: LoadingService,
    private store: StorageService,
    protected timer: TimerService,
    protected common: Common,
    private router: Router,
    private utils: UtilsService) {

  }

  async ngOnInit() {
    console.log('Enter onOnInit')

    //Ffmpeg('../../../assets/mas.mp3').format('m4a')
    let permissions = await this.checkPermissions()
    if (permissions.microphone != MicrophonePermissionStateValue.granted) {
      await this.requestPermissions()
    }
    let filePermissions = await Filesystem.checkPermissions()
    if (filePermissions.publicStorage != 'granted') {
      const requestPermissionsResult = await Filesystem.requestPermissions();
      console.log('requestPermissionsResult: ' + JSON.stringify(requestPermissionsResult));
    }
  }



  textAdded(text: string){
    this.recordingData.push({
      text: text
    })
    console.log(this.recordingData)
  }

  // processAudio() {
  //   let audioElement = document.getElementById('dataAu');
  //   let audioContext = new window.AudioContext();
  //   let sourceUrl = audioElement?.querySelector('source')?.src as string | URL | Request;

  //   fetch(sourceUrl)
  //     .then(response => response.arrayBuffer())
  //     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  //     .then(audioBuffer => {
  //       let quantizedData = this.quantizeAudioData(audioBuffer, 30);
  //       console.log(quantizedData);
  //     })
  //     .catch(error => console.error('Error processing audio:', error));
  // }

  // quantizeAudioData(buffer:any, numElements:any) {
  //   let data = buffer.getChannelData(0); // Obtener datos del canal izquierdo
  //   console.log('raw decoded data',data)
  //   let segmentLength = Math.floor(data.length / numElements);
  //   let quantizedData = [];

  //   for (let i = 0; i < numElements; i++) {
  //     let start = i * segmentLength;
  //     let end = start + segmentLength;
  //     let segment = data.slice(start, end);
  //     let sum = 0;

  //     for (let j = 0; j < segment.length; j++) {
  //       sum += Math.abs(segment[j]);
  //     }

  //     let avg = sum / segment.length;
  //     quantizedData.push(avg);
  //   }

  //   return quantizedData;
  // }
  ionViewDidLeave(){
    this.actionSubscription.unsubscribe()
    let un: any = undefined
    this.common.selectedSong = un
    console.log("leaving")
    this.clearData()
  }

  async ionViewDidEnter() {

    this.actionSubscription = this.common.$actions.subscribe(action => {
      if(action == Actions.START_AUDIO_REC){
        this.startRecording()
      } else if(action == Actions.STOP_AUDIO_REC) {
        this.stopRecording()
      }
    })

    this.common.changeCenterImage('rec')
    this.songData = this.common.selectedSong
    console.log(this.songData)
    if (this.songData) { 
      this.loading.show()
      this.category = this.songData.category
      this.songName = this.songData.song
      this.oldSongname = this.songName
      this.recordingData = this.songData.data
      let promises: Promise<ReadFileResult>[] = []

      for (let fl of this.recordingData) {
        if (fl.path)
          promises.push(Filesystem.readFile({
            path: fl.path,
          }))
        else
          promises.push(Promise.resolve({ data: '' }))
      }
      
      try {
        let resultResult = await Promise.all(promises)
        this.recordingData.forEach((obj, c) => {
          if (obj.path){
            obj.data = 'data:audio/aac;base64,' + <string>resultResult[c].data
          }
            
        })
        // this.recordingData.push({
        //   text: ''
        // })
        this.loading.hide()
      } catch (err) {
        this.loading.hide()
      }

    } else {
      //test
      // this.dummyData()
      // this.recordingData.push({
      //   text: ''
      // })
    }

  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    this.removeEmptyText()
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.recordingData = ev.detail.complete(this.recordingData);
    if (
      !this.recordingData[this.recordingData.length - 1].text ||
      this.recordingData[this.recordingData.length - 1].text && this.recordingData[this.recordingData.length - 1].text != '') {
      this.recordingData.push({ text: '' })
    }
    //console.log('Array',Object.assign({},this.recordingData))
  }

  dummyData() {
    this.recordingData = [
      {
        text: 'Hola mundo'
      },
      {
        path: '',
        data: '../../../assets/mas.mp3'
      },
      {
        path: '',
        data: '../../../assets/mas.mp3'
      },
      {
        path: '',
        data: '../../../assets/mas.mp3'
      },
      {
        text: 'Hola mundo'
      },
      {
        path: '',
        data: '../../../assets/mas.mp3'
      },

    ]
  }

  test() {
    console.log('cliock')
  }

  deleteItem(item: RecordingData, index: number) {
    if (this.recordingData.length > 1) {
      this.recordingData.splice(index, 1);
      if (item.path?.includes('storage/emulated/0/Documents'))
        this.deletedAudio.push(item)
    }
  }

  async shareSong(item: RecordingData) {
    let result = await Filesystem.writeFile({
      directory: Directory.Cache,
      path: `${MAIN_DIRECTORY}/CACHE/${this.utils.makeId(5)}.m4a`,
      data: <string>item.data,
      recursive: true
    })

    console.log('URL', result.uri)
    await Share.share({
      files: [result.uri],
    });
  }

  async checkPermissions(): Promise<PermissionStatus> {
    try {
      const checkPermissionsResult = await Microphone.checkPermissions();
      console.log('checkPermissionsResult: ' + JSON.stringify(checkPermissionsResult));
      return checkPermissionsResult
    } catch (error) {
      console.error('checkPermissions Error: ' + JSON.stringify(error));
      return { microphone: "denied" }
    }
  }

  async requestPermissions() {
    try {
      const requestPermissionsResult = await Microphone.requestPermissions();
      console.log('requestPermissionsResult: ' + JSON.stringify(requestPermissionsResult));
    } catch (error) {
      console.error('requestPermissions Error: ' + JSON.stringify(error));
    }
  }

  removeEmptyText() {
    this.recordingData = this.recordingData.filter(data => {
      return data.path || data.text != ''
    })
  }


  async startRecording() {
    try {
      //this.loading.show()
      this.isRecording = true
      //this.timer.resetStopwatch()
      const startRecordingResult = await Microphone.startRecording();
      //this.timer.startStopwatch()
      console.log(startRecordingResult)
      console.log('startRecordingResult: ' + JSON.stringify(startRecordingResult));
      //this.loading.hide()
    } catch (error) {
      console.log(error)
      console.error('startRecordingResult Error: ' + JSON.stringify(error));
      // this.loading.hide()
    }

  }

  async stopRecording() {
    try {
      //this.loading.show()

      //this.timer.stopStopwatch()
      this.isRecording = false
      this.recording = await Microphone.stopRecording();
      console.log(this.recording)
      this.removeEmptyText()
      this.recordingData.push({
        path: <string>this.recording.webPath,
        data: <string>this.recording.dataUrl
      })
      // this.recordingData[this.recordingData.length - 1].path = <string>this.recording.webPath
      // this.recordingData[this.recordingData.length - 1].data = <string>this.recording.dataUrl
      // this.recordingData.push({
      //   text: ''
      // })

      this.loading.hide()
    } catch (error) {
      console.error('recordingResult Error: ' + JSON.stringify(error));
      this.loading.hide()
    }
  }

  async saveData() {
    if(this.songName == "" || this.category == "") return
    this.loading.show()
    await this.store.set(SONGS_PATH, this.songName)
    await this.store.set(FOLDERS_PATH, this.category)
    //this.removeEmptyText()

    let promises: Promise<WriteFileResult>[] = []
    let c = 0

    let deletedAudioPromises: Promise<void>[] = []
    this.deletedAudio.forEach(a => {
      deletedAudioPromises.push(
        Filesystem.deleteFile({
          directory: Directory.External,
          path: <string>a.path,
        })
      )
    })
    await Promise.all(deletedAudioPromises)
    for (let data of this.recordingData) {
      if (data.data && data.data != '') {
        promises.push(
          Filesystem.writeFile({
            path: `${MAIN_DIRECTORY}/${this.utils.removeCharacters(this.songName)}-${c}${this.utils.makeId(5)}.m4a`,
            data: data.data,
            directory: Directory.External,
            recursive: true

          })
        )
      } else {
        promises.push(Promise.resolve({ uri: '' }))
      }

      c = c + 1
    }

    let writeResult = await Promise.all(promises)
    if (this.oldSongname)
      await this.store.removeItemByParam(RECORDINGS_PATH, 'song', this.oldSongname)
    await this.store.set(RECORDINGS_PATH, {
      song: this.songName,
      category: this.category,
      data: this.recordingData.map((data, c) => {
        return {
          path: data.path ? writeResult[c].uri : undefined,
          text: data.text
        //  data: data.path ? '' : undefined
        }
        //data.data != ''? `${MAIN_DIRECTORY}/${this.category}-${this.songName}-${c}.m4a`:''
      })
    })
    console.log(writeResult)
    this.loading.hide()
    this.clearData()
    this.store.fillValues()
    this.router.navigate(['tabs/home'])
  }

  clearData() {
    let un: any = undefined
    this.songData = un
    this.category = "Principal"
    this.songName = ''
    this.oldSongname = un
    this.common.selectedSong = un
    this.recordingData = []
  }
}
