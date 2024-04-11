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

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.page.html',
  styleUrls: ['./new-song.page.scss'],
})
export class NewSongPage implements OnInit {
  recording!: AudioRecording;
  webPaths = [];
  dataUrls = [];
  recordingData: RecordingData[] = [{
    text: '',
    path: '',
    data: ''
  }]
  isRecording = false


  category = "Principal"
  songName = ''
  songData!: Song

  constructor(private loading: LoadingService,
    private store: StorageService,
    protected timer: TimerService,
    protected common: Common,
    private router: Router) {

  }

  async ngOnInit() {


    let permissions = await this.checkPermissions()
    if (permissions.microphone != MicrophonePermissionStateValue.granted) {
      this.requestPermissions()
    }
  }

  async ionViewDidEnter() {
    this.songData = this.common.selectedSong
    console.log(this.songData)
    if (this.songData) {
      this.category = this.songData.category
      this.songName = this.songData.song
      this.recordingData = this.songData.data
      // .map(d => {
      //   return {
      //     text: d.text,
      //     path: d.path,
      //     data: d?.data || ''
      //   }
      // })
      let promises: Promise<ReadFileResult>[] = []
      for (let fl of this.recordingData) {
        promises.push(Filesystem.readFile({
          path: fl.path,
          directory: Directory.Documents
        }))
      }

      let resultResult = await Promise.all(promises)
      this.recordingData.forEach((obj, c) => {
        obj.data = <string>resultResult[c].data
      })
    }

  }

  test() {
    console.log('cliock')
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
      console.log('recording: ' + JSON.stringify(this.recording));
      console.log('recording.dataUrl: ' + JSON.stringify(this.recording.dataUrl));
      console.log('recording.duration: ' + JSON.stringify(this.recording.duration));
      console.log('recording.format: ' + JSON.stringify(this.recording.format));
      console.log('recording.mimeType: ' + JSON.stringify(this.recording.mimeType));
      console.log('recording.path: ' + JSON.stringify(this.recording.path));
      console.log('recording.webPath: ' + JSON.stringify(this.recording.webPath));
      // @ts-ignore
      this.webPaths.push(this.recording.webPath);
      // @ts-ignore
      this.dataUrls.push(this.recording.dataUrl);

      this.recordingData[this.recordingData.length - 1].path = <string>this.recording.webPath
      this.recordingData[this.recordingData.length - 1].data = <string>this.recording.dataUrl
      this.recordingData.push({
        text: '',
        path: '',
        data: '',
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

    let promises: Promise<WriteFileResult>[] = []
    let c = 0
    for (let data of this.recordingData) {
      if (data.data != '') {
        promises.push(
          Filesystem.writeFile({
            path: `${MAIN_DIRECTORY}/${this.category}-${this.songName}-${c}.m4a`,
            data: data.data,
            directory: Directory.Documents,
            recursive: true

          })
        )
      }

      c = c + 1
    }

    let writeResult = await Promise.all(promises)


    await this.store.set(RECORDINGS_PATH, {
      song: this.songName,
      category: this.category,
      data: this.recordingData.map((data, c) => {
        return {
          text: data.text,
          path: data.data != '' ? writeResult[c].uri : '',
          data: ''
        }
        //data.data != ''? `${MAIN_DIRECTORY}/${this.category}-${this.songName}-${c}.m4a`:''
      })
    })
    console.log(writeResult)
    this.loading.hide()
  }

  clearData() {
    let un: any = undefined
    this.songData = un
    this.category = "Principal"
    this.songName = ''
    this.recordingData = [{
      text: '',
      path: '',
      data: ''
    }]
  }
}
