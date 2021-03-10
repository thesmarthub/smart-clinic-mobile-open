import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadHospitals } from 'src/app/actions/events/hospital';
import { Store } from 'src/app/engine/store';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.page.html',
  styleUrls: ['./hospitals.page.scss'],
})
export class HospitalsPage implements OnInit {
  storeCtrl = new Store()

  constructor(public hService: HospitalService, 
  public atrCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.hService.triggerEvent(LoadHospitals)
  }

  async showConfirmAlert(item) {
    const alert = await this.atrCtrl.create({
      cssClass: 'my-custom-class',
      header: `Hi ${this.storeCtrl.user.fname}`,
      message: `Your profile wasn't found in <strong>${item.name}</strong>. Do you want to register there? `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          
          }
        }, {
          text: 'Register',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
      

}
