import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(private loadingCtrl: LoadingController) {}

  async show(message = "Espere...") {
    const loading = await this.loadingCtrl.create({
      message: message,
      duration: 7000
    });

    loading.present();
  }



   hide(){
    this.loadingCtrl.dismiss()
   }


}