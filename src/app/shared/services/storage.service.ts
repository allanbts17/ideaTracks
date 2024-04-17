import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Common } from '../classes/common';
import { DEFAULT_FOLDER, FOLDERS_PATH, RECORDINGS_PATH, SONGS_PATH } from 'src/app/shared/classes/constans';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage,
    private common: Common
  ) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    await this.fillValues() 
  }

  async fillValues(){
    this.common.categories = await this.get(FOLDERS_PATH)
    if(this.common.categories.length == 0)
      this.common.categories.push(DEFAULT_FOLDER)
    this.common.songs = await this.get(SONGS_PATH)
    this.common.recordingData = await this.get(RECORDINGS_PATH)
    console.log(this.common)
  }

  async set(key: string, value: any): Promise<void> {
    let data: any[] = await this.get(key) || []
    data.push(value)
    data = data.filter((item, index) => {
      return data.indexOf(item) === index;
    });
    await this._storage?.set(key, data);
  }

  async get(key: string): Promise<any> {
    return await this._storage?.get(key) || [];
  }

  // async remove(key: string, value: any): Promise<void> {
  //   await this._storage?.remove(key);
  // }

  async removeItemByParam(key: string, param: string, value: string) {
    const storedData = await this.get(key)
    var index = storedData.findIndex((obj: any) => obj[param] == value)
    storedData.splice(index, 1)
    return this._storage?.set(key, storedData)
  }


  async clear(key: string, value: any): Promise<void> {
    await this._storage?.clear();
  }
}