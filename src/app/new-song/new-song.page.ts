import { Component, OnInit } from '@angular/core';
import { Microphone, AudioRecording } from '@mozartec/capacitor-microphone';

@Component({
  selector: 'app-new-song',
  templateUrl: './new-song.page.html',
  styleUrls: ['./new-song.page.scss'],
})
export class NewSongPage implements OnInit {
  recording!: AudioRecording;
  webPaths = [];
  dataUrls = [];
  constructor() { }

  ngOnInit() {
  }

  async checkPermissions() {
    try {
      const checkPermissionsResult = await Microphone.checkPermissions();
      console.log('checkPermissionsResult: ' + JSON.stringify(checkPermissionsResult));
    } catch (error) {
      console.error('checkPermissions Error: ' + JSON.stringify(error));
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
      const startRecordingResult = await Microphone.startRecording();
      console.log(startRecordingResult)
      console.log('startRecordingResult: ' + JSON.stringify(startRecordingResult));
    } catch (error) {
      console.log(error)
      console.error('startRecordingResult Error: ' + JSON.stringify(error));
    }

  }

  async stopRecording() {
    try {
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
    } catch (error) {
      console.error('recordingResult Error: ' + JSON.stringify(error));
    }
  }

}
