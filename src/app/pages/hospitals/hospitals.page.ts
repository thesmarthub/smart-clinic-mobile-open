import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadHospitals } from 'src/app/actions/events/hospital';
import { Store } from 'src/app/engine/store';
import { HospitalService } from 'src/app/services/hospital.service';
import {Location} from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.page.html',
  styleUrls: ['./hospitals.page.scss'],
})
export class HospitalsPage implements OnInit {
  storeCtrl = new Store()

  constructor(public hService: HospitalService, 
  public atrCtrl: AlertController,
  public route: Router,
  public _location: Location,
  public authService: AuthService) { }

  ngOnInit() {
   
  }

  ionViewDidEnter() {
    this.hService.triggerEvent(LoadHospitals)
  }

  async showConfirmAlert(item) {
    if(this.storeCtrl.user.hospital_smart_codes.includes(item.smart_code)){
      this.authService.fetchActiveHospitalAndProfile(item.smart_code)
    } else {
    const alert = await this.atrCtrl.create({
      cssClass: 'my-custom-class',
      header: `Hi ${this.storeCtrl.user.fname}`,
      message: `Your profile wasn't found in <strong>${item.name}</strong>. Do you want to register there? `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Register',
          handler: () => {
            this.hService.tempHospital = item
            this.route.navigateByUrl('/hospital-reg')
          }
        }
      ]
    });

    await alert.present();
  }}
      
  backClicked() {
    this._location.back();
  }
}
