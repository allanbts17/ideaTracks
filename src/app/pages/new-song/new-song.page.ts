import { Component, OnInit } from '@angular/core';
import { Microphone, AudioRecording, PermissionStatus, MicrophonePermissionStateValue } from '@mozartec/capacitor-microphone';
import { RecordingData, Song } from 'src/app/shared/interfaces/song';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { Filesystem, Directory, Encoding, WriteFileResult, ReadFileResult } from '@capacitor/filesystem';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FOLDERS_PATH, MAIN_DIRECTORY, RECORDINGS_PATH, SONGS_PATH } from 'src/app/shared/classes/constans';
import { TimerService } from 'src/app/shared/services/timer.service';
import { Common } from 'src/app/shared/classes/common';
import { Router } from '@angular/router';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { UtilsService } from 'src/app/shared/services/utils.service';
//var Ffmpeg = require('fluent-ffmpeg');
//import * as Ffmpeg from 'fluent-ffmpeg'
@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.page.html',
  styleUrls: ['./new-song.page.scss'],
})
export class NewSongPage implements OnInit {
  recording!: AudioRecording;
  recordingData: RecordingData[] = [{
    text: ''
  }]
  isRecording = false


  category = "Principal"
  songName = ''
  songData!: Song
  oldSongname!: string
  disableReorder = true
  deletedAudio: RecordingData[] = []

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

  async ionViewDidEnter() {


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
          promises.push(Promise.resolve({ data: ''}))
      }
      try {
        let resultResult = await Promise.all(promises)
        this.recordingData.forEach((obj, c) => {
          if(obj.path)
            obj.data = 'data:audio/aac;base64,' + <string>resultResult[c].data
        })
        this.recordingData.push({
          text: ''
        })
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
    if(
      !this.recordingData[this.recordingData.length -1].text ||
      this.recordingData[this.recordingData.length -1].text && this.recordingData[this.recordingData.length -1].text != ''){
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

  deleteItem(item: RecordingData, index: number){
    if(this.recordingData.length > 1){
      this.recordingData.splice(index, 1);
      if(item.path?.includes('storage/emulated/0/Documents'))
        this.deletedAudio.push(item)
    }
  }

  async shareSong(item: RecordingData){
    let result = await Filesystem.writeFile({
      directory: Directory.Cache,
      path:`${MAIN_DIRECTORY}/CACHE/${this.utils.makeId(5)}.m4a`,
      data: <string>item.data,
      recursive: true
    })
    
    console.log('URL',result.uri)
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

  removeEmptyText(){
    this.recordingData = this.recordingData.filter(data => {
      return data.path || data.text != ''
    })
  }


  async startRecording() {
    try {
      //this.loading.show()
      this.isRecording = true
      this.timer.resetStopwatch()
      const startRecordingResult = await Microphone.startRecording();
      this.timer.startStopwatch()
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

      this.timer.stopStopwatch()
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
      this.recordingData.push({
        text: ''
      })

      this.loading.hide()
    } catch (error) {
      console.error('recordingResult Error: ' + JSON.stringify(error));
      this.loading.hide()
    }
  }

  async saveData() {
    this.loading.show()
    await this.store.set(SONGS_PATH, this.songName)
    await this.store.set(FOLDERS_PATH, this.category)
    this.removeEmptyText()

    let promises: Promise<WriteFileResult>[] = []
    let c = 0

    let deletedAudioPromises: Promise<void>[] = []
    this.deletedAudio.forEach(a => {
      deletedAudioPromises.push(
        Filesystem.deleteFile({
          directory: Directory.Documents,
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
            directory: Directory.Documents,
            recursive: true

          })
        )
      } else {
        promises.push(Promise.resolve({ uri: ''}))
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
          text: data.text,
          path: data.path? writeResult[c].uri :undefined,
          data: data.path? '':undefined
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
    this.recordingData = [{
      text: '',
      path: '',
      data: ''
    }]
  }
}
