import { Injectable } from '@angular/core';
import { Song } from '../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class Common {
  categories: string[] =[]
  songs: string[] = []
  recordingData: Song[] = []
  selectedSong!: Song
}
