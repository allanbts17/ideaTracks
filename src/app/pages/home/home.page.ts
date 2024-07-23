import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/shared/classes/common';
import { DEFAULT_FOLDER, FOLDERS_PATH, RECORDINGS_PATH, SONGS_PATH } from 'src/app/shared/classes/constans';
import { Song } from 'src/app/shared/interfaces/song';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private store: StorageService,
    protected common: Common,
    private router: Router) { }
  selectedCategory = DEFAULT_FOLDER
  async ngOnInit() {
    this.common.categories = [ DEFAULT_FOLDER, 'Cantos']
    this.common.songs = [ 'Día a dia', 'Elijo creer']

  }

  getFilteredSongs(){
    return this.common.recordingData.filter(song => {
      return song.category == this.selectedCategory
    })
  }

  navigate(song: Song){
    this.common.selectedSong = song
    this.router.navigate(['tabs','new-song'],{ state: song })
  }

}
