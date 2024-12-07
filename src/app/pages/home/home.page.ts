import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/shared/classes/common';
import { DEFAULT_FOLDER, FOLDERS_PATH, RECORDINGS_PATH, SONGS_PATH } from 'src/app/shared/classes/constans';
import { Song } from 'src/app/shared/interfaces/song';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  backdropId: string
  constructor(private store: StorageService,
    protected common: Common,
    private router: Router,
  private utils: UtilsService) { 
    this.backdropId = utils.makeId(5).toString()
    
  }
  selectedCategory = DEFAULT_FOLDER
  async ngOnInit() {
    //this.common.categories = await this.store.get(FOLDERS_PATH)
    
    // this.common.categories = [ DEFAULT_FOLDER, 'Cantos']
    // this.common.songs = [ 'Día a dia', 'Elijo creer']
    //this.common.changeCenterImage('add')
  }

  ionViewDidEnter(){
    console.log('initi')
    this.common.changeCenterImage('add')
  }

  getFilteredSongs(){
    return this.common.recordingData.filter(song => {
      return song.category == this.selectedCategory
    })
  }

  // getTracksQuantity(song: Song){
  //   let tracks = song.data.filter((d => d.path)) || []
  //   return tracks.length
  // }

  navigate(song: Song){
    this.common.selectedSong = song
    this.router.navigate(['tabs','new-song'])
  }

}
