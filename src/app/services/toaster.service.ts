import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(public toastController: ToastController) { }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 1000,
      color:"success"
    });
    toast.present();
  }

  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      // header: 'Toast header',
      duration: 2000,
      color:"tertiary",
      message: message,
      position: 'top',
      buttons: [
        {
          // side: 'start',
          // icon: 'star',
          // text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
