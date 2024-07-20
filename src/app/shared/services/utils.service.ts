import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  makeId(size: number): number {
    let id = '';
    const characters = '0123456789';
  
    for (let i = 0; i < size; i++) {
      const index = Math.floor(Math.random() * characters.length);
      id += characters.charAt(index);
    }
  
    return parseInt(id, 10);
  }

  removeCharacters(data: string){
        const chars = /[\\/:*?"<>|]/g;
        return data.replace(chars, '');
  }  
}
